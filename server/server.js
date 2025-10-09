const express = require("express");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const userRoutes = require("./routes/api/users");
const recipeRoutes = require("./routes/api/recipes");
const commentRoutes = require("./routes/api/comments");
const activityRoutes = require("./routes/api/activity");
const chatRoutes = require("./routes/api/chats"); // NEW: Import chat routes
const cors = require("cors");
const path = require("path");
const Chat = require('./models/Chat');
const User = require('./models/User'); // NEW: Import User model

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

const userSocketMap = new Map();

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
});

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use((req, res, next) => {
    req.io = io;
    req.userSocketMap = userSocketMap;
    next();
});

app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/chats", chatRoutes); // NEW: Add chat routes middleware

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
    res.send("API is running...");
});

io.on("connection", (socket) => {
    console.log(`[SOCKET] User connected: ${socket.id}`);

    // Modified: Attach userId to the socket
    socket.on("register", (userId) => {
        if (userId) {
            userSocketMap.set(userId, socket.id);
            socket.userId = userId; // NEW: Attach userId to the socket for easy lookup
            console.log(
                `[SOCKET] User ${userId} registered with socket ${socket.id}`
            );
        }
    });

    // NEW: Handle private chat messages
    socket.on("private_message", async ({ recipientId, content }) => {
        const senderId = socket.userId;
        if (!senderId) {
            console.log('[SOCKET] Message received from unregistered socket');
            return;
        }

        const recipientSocketId = userSocketMap.get(recipientId);

        if (recipientSocketId) {
            try {
                // Find or create chat
                let chat = await Chat.findOne({
                    participants: { $all: [senderId, recipientId] }
                });
                if (!chat) {
                    chat = await Chat.create({ participants: [senderId, recipientId], messages: [] });
                }

                // Add message to the chat
                const newMessage = {
                    sender: senderId,
                    content,
                };
                chat.messages.push(newMessage);
                await chat.save();

                // Get sender details to send a complete message to the recipient
                const senderUser = await User.findById(senderId).select('name profilePic');
                const fullMessage = {
                    _id: newMessage._id,
                    sender: {
                        _id: senderUser._id,
                        name: senderUser.name,
                        profilePic: senderUser.profilePic,
                    },
                    content,
                    createdAt: new Date(),
                };

                // Emit the message to the recipient's socket
                io.to(recipientSocketId).emit('private_message', {
                    chatId: chat._id.toString(),
                    message: fullMessage,
                });

                // Also emit back to the sender for real-time display
                socket.emit('private_message_sent', {
                    chatId: chat._id.toString(),
                    message: fullMessage,
                });
            } catch (error) {
                console.error('[SOCKET ERROR] Failed to send private message:', error);
            }
        } else {
            console.log(`[SOCKET] Recipient ${recipientId} is offline.`);
        }
    });

    // Modified: use the new userId attached to the socket
    socket.on("disconnect", () => {
        if (socket.userId) {
            userSocketMap.delete(socket.userId);
            console.log(`[SOCKET] User ${socket.userId} disconnected`);
        }
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

httpServer.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT} (HTTP & Sockets)`
    )
);