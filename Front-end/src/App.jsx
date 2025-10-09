import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import Profile from './Pages/Profile';
import RecipeUpload from './Pages/RecipeUpload';
import RecipeDetail from './Pages/RecipeDetail';
import AIRecipeDetail from './Pages/AIRecipeDetail';
import MealPlanner from './Pages/MealPlanner';
import Challenges from './Pages/Challenges';
import Chat from './Pages/Chat';
import { loadUser } from './features/auth/authSlice';
import './index.css';

import { SocketProvider, useSocket } from './context/SocketContext';
import { addRecentActivity } from './features/dashboard/dashboardSlice';

const pageVariants = {
    initial: { opacity: 0, x: "-5%", scale: 0.98 },
    in: { opacity: 1, x: 0, scale: 1 },
    out: { opacity: 0, x: "5%", scale: 1.02 }
};

const pageTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    duration: 0.3
};

const NotificationHandler = () => {
    const { socket } = useSocket();
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (socket && user) {
            socket.emit('register', user._id);
            console.log(`[CLIENT] Registering user ${user._id} with socket.`);

            socket.on('new_notification', (data) => {
                console.log('Received new notification:', data);
                
                toast.success(data.message, {
                    onClick: () => {
                        window.location.href = data.link; 
                    },
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                if (data.type === 'like' && user._id.toString() === data.recipeAuthorId) {
                    dispatch(addRecentActivity({
                        action: 'Liked',
                        recipe: {
                            _id: data.recipeId,
                            title: data.message.match(/"(.*?)"/)?.[1] || 'Your Recipe'
                        },
                        liker: { 
                            name: data.message.match(/(.*?) liked/)?.[1] || 'Someone'
                        },
                        createdAt: new Date().toISOString()
                    }));
                }
            });

            // Handle incoming private messages and display a toast notification
            socket.on('private_message', (data) => {
                console.log('Received new private message:', data);
                toast.info(`New message from ${data.message.sender.name}`, {
                    onClick: () => {
                        // Navigate to the chat page and open the specific chat
                        window.location.href = `/chats?chatId=${data.chatId}&userId=${data.message.sender._id}`;
                    },
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });

        }
        
        return () => {
            if (socket) {
                socket.off('new_notification');
                socket.off('private_message');
            }
        };
    }, [socket, user, dispatch]);

    return null;
}

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    return (
        <SocketProvider>
            {/* 1. Main container: Full screen height (h-screen) and set to flex-col for vertical stacking */}
            <div className="flex flex-col h-screen bg-gray-100 font-sans">
                
                {/* 2. Full-Width Navbar at the Top */}
                <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                
                {/* 3. Content Row (Sidebar + Main View) */}
                <div className="flex flex-1 overflow-hidden">
                    
                    {/* 4. Sidebar: Fixed width (w-64) and fixed height (h-full of its parent) */}
                    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    
                    {/* 5. Main Content Area (Home/Routes): flex-1 ensures it fills the remaining width. 
                           overflow-y-auto enables scrolling for the main content only. */}
                    <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            <Routes location={location} key={location.pathname}>
                                <Route path="/" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Home /></motion.div>} />
                                <Route path="/login" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Login /></motion.div>} />
                                <Route path="/signup" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Signup /></motion.div>} />
                                <Route path="/dashboard" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Dashboard /></motion.div>} />
                                <Route path="/profile" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Profile /></motion.div>} />
                                <Route path="/upload" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><RecipeUpload /></motion.div>} />
                                <Route path="/recipe/:id" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><RecipeDetail /></motion.div>} />
                                <Route path="/ai-recipe/:id" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><AIRecipeDetail /></motion.div>} />
                                <Route path="/meal-planner" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><MealPlanner /></motion.div>} />
                                <Route path="/challenges" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Challenges /></motion.div>} />
                                <Route path="/chats" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Chat /></motion.div>} />
                            </Routes>
                        </AnimatePresence>
                    </main>
                </div>
                <NotificationHandler />
                <ToastContainer position="bottom-right" />
            </div>
        </SocketProvider>
    );
}

export default App;