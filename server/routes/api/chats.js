const express = require('express');
const asyncHandler = require('express-async-handler');
const { protect } = require('../../middleware/auth');
const Chat = require('../../models/Chat');
const User = require('../../models/User');

const router = express.Router();

// @desc    Get or create a private chat with another user
// @route   POST /api/chats
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
    const { partnerId } = req.body;
    const currentUserId = req.user._id;

    if (currentUserId.toString() === partnerId) {
        res.status(400);
        throw new Error("Cannot chat with yourself.");
    }

    // Find if a chat already exists between the two users
    let chat = await Chat.findOne({
        participants: { $all: [currentUserId, partnerId] }
    })
    .populate('participants', 'name profilePic')
    .populate('messages.sender', 'name profilePic');

    // If no chat exists, create a new one
    if (!chat) {
        chat = await Chat.create({
            participants: [currentUserId, partnerId],
            messages: []
        });

        // Re-populate the new chat to send back a complete object
        chat = await chat.populate('participants', 'name profilePic');
    }

    res.status(200).json(chat);
}));

// @desc    Send a message in an existing chat
// @route   POST /api/chats/:chatId/messages
// @access  Private
router.post('/:chatId/messages', protect, asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const { message } = req.body;
    const senderId = req.user._id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
        res.status(404);
        throw new Error("Chat not found");
    }

    // Check if the current user is a participant of the chat
    if (!chat.participants.some(p => p.toString() === senderId.toString())) {
        res.status(403);
        throw new Error("You are not a member of this chat");
    }

    const newMessage = {
        sender: senderId,
        content: message,
    };

    chat.messages.push(newMessage);
    await chat.save();

    // Get the recipient's ID
    const recipientId = chat.participants.find(p => p.toString() !== senderId.toString()).toString();

    // Use the `userSocketMap` to find the recipient's socket and emit the message
    const recipientSocketId = req.userSocketMap.get(recipientId);
    if (recipientSocketId) {
        const fullMessage = {
            ...newMessage,
            sender: {
                _id: senderId,
                name: req.user.name,
                profilePic: req.user.profilePic,
            }
        };
        req.io.to(recipientSocketId).emit('private_message', {
            chatId,
            message: fullMessage,
        });
    }

    res.status(201).json({
        message: 'Message sent successfully'
    });
}));


// @desc    Get all chats for the logged-in user
// @route   GET /api/chats
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const chats = await Chat.find({
        participants: userId
    })
    .populate('participants', 'name profilePic')
    .populate('messages.sender', 'name profilePic')
    .sort({ updatedAt: -1 });

    res.status(200).json(chats);
}));


module.exports = router;