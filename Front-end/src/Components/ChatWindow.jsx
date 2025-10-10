import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { IoIosSend } from 'react-icons/io';
import { ImCancelCircle } from 'react-icons/im';
import { API_BASE_URL } from '../utils/config';

const ChatWindow = ({ partner, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatId, setChatId] = useState(null);
    const [loading, setLoading] = useState(false);

    const { socket } = useSocket();
    const { user } = useSelector(state => state.auth);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchChat = async () => {
            setLoading(true);
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                // CORRECTED API ENDPOINT: Now points to /api/chats
                const { data } = await axios.post(
                    `${API_BASE_URL}/api/chats/'`,
                    { partnerId: partner._id },
                    config
                );
                setMessages(data.messages);
                setChatId(data._id);
            } catch (error) {
                console.error('Error fetching chat:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user && partner) {
            fetchChat();
        }
    }, [user, partner]);

    useEffect(() => {
        if (socket) {
            const handleIncomingMessage = (data) => {
                if (data.chatId === chatId) {
                    setMessages((prevMessages) => [...prevMessages, data.message]);
                }
            };
            socket.on('private_message', handleIncomingMessage);

            const handleSentMessage = (data) => {
                if (data.chatId === chatId) {
                    setMessages((prevMessages) => [...prevMessages, data.message]);
                }
            };
            socket.on('private_message_sent', handleSentMessage);
            
            return () => {
                socket.off('private_message', handleIncomingMessage);
                socket.off('private_message_sent', handleSentMessage);
            };
        }
    }, [socket, chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !chatId) return;

        // Send message via socket
        socket.emit('private_message', {
            recipientId: partner._id,
            content: newMessage,
        });

        setNewMessage('');
    };

    if (loading) {
        return <div className="p-4 text-center">Loading chat...</div>;
    }

    return (
        <div className="fixed bottom-4 right-4 w-[400px] h-[500px] bg-white rounded-lg shadow-xl flex flex-col z-50">
            <div className="bg-orange-500 text-white p-4 rounded-t-lg flex justify-between items-center">
                <div className="flex items-center">
                    <img
                        src={partner.profilePic || '/default-avatar.png'}
                        alt={partner.name}
                        className="w-10 h-10 rounded-full mr-3 border-2 border-white"
                    />
                    <h3 className="font-semibold">{partner.name}</h3>
                </div>
                <button onClick={onClose} className="text-white hover:text-gray-200">
                    <ImCancelCircle size={24} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            msg.sender._id === user._id ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`p-3 rounded-lg max-w-[75%] ${
                                msg.sender._id === user._id
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            }`}
                        >
                            <p className="text-sm">{msg.content}</p>
                            <span className="block text-xs text-right opacity-70 mt-1">
                                {new Date(msg.createdAt).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                    type="submit"
                    className="ml-3 p-2 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                >
                    <IoIosSend size={24} />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;