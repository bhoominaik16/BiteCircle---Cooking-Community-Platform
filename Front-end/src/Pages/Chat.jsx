import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatWindow from '../Components/ChatWindow';
import { loadUser } from '../features/auth/authSlice';

const Chat = () => {
    const { isLoggedIn, user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [loading, setLoading] = useState(false); // Changed to false initially
    const [authLoading, setAuthLoading] = useState(true); // NEW: State for authentication loading
    const [error, setError] = useState(null);

    // NEW: First useEffect to handle authentication check
    useEffect(() => {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        if (!isLoggedIn && token) {
            dispatch(loadUser());
        } else {
            setAuthLoading(false);
        }
    }, [isLoggedIn, dispatch]);

    // NEW: Second useEffect to fetch chats after authentication is confirmed
    useEffect(() => {
        if (authLoading) return; // Wait until authentication is complete

        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        const fetchChats = async () => {
            try {
                setLoading(true);
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get('http://localhost:5000/api/chats', config);
                const filteredChats = data.filter(chat => chat.messages && chat.messages.length > 0);
                setChats(filteredChats);

                const urlParams = new URLSearchParams(window.location.search);
                const chatId = urlParams.get('chatId');
                if (chatId) {
                    const initialChat = filteredChats.find(chat => chat._id === chatId);
                    if (initialChat) {
                        setSelectedChat(initialChat);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch chats:', err);
                setError('Failed to load conversations.');
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, [isLoggedIn, user, authLoading, navigate]);

    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
    };

    if (authLoading || loading) {
        return <div className="text-center py-10">Loading chats...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="flex h-[calc(100vh-100px)] max-w-7xl mx-auto rounded-xl shadow-lg overflow-hidden bg-white">
            {/* Conversations Sidebar */}
            <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                </div>
                {chats.length > 0 ? (
                    chats.map(chat => {
                        const otherParticipant = chat.participants.find(p => p._id !== user._id);
                        return (
                            <div
                                key={chat._id}
                                className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-150 ${
                                    selectedChat?._id === chat._id ? 'bg-orange-100' : ''
                                }`}
                                onClick={() => handleChatSelect(chat)}
                            >
                                <img
                                    src={otherParticipant?.profilePic || '/default-avatar.png'}
                                    alt={otherParticipant?.name}
                                    className="w-12 h-12 rounded-full mr-3 border-2 border-orange-300"
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-800">{otherParticipant?.name}</h4>
                                    <p className="text-sm text-gray-500 truncate">{chat.messages[chat.messages.length - 1]?.content || 'No messages yet'}</p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-4 text-center text-gray-500">
                        No conversations yet. Start a chat by messaging a recipe uploader.
                    </div>
                )}
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
                {selectedChat ? (
                    <ChatWindow partner={selectedChat.participants.find(p => p._id !== user._id)} onClose={() => setSelectedChat(null)} />
                ) : (
                    <div className="flex-1 flex items-center justify-center p-6 text-gray-500 text-center">
                        <div className="flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                            <h3 className="text-xl font-semibold mb-2">Select a Conversation</h3>
                            <p className="max-w-xs">Click on a person from the left pane to view your chat history and send messages.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;