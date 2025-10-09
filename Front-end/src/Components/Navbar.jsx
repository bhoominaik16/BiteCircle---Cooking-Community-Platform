import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { FaRegCommentDots } from 'react-icons/fa'; // NEW: Import icon for chat button
import logo from "../assets/BiteCircle_logo.png";
import profile from '../assets/profile.png';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector(state => state.auth);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        setIsDropdownOpen(false);
    };

    return (
        <nav className="bg-gradient-to-r from-gray-50 to-gray-100 shadow-lg py-3 px-4 md:py-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="mr-2 md:hidden text-gray-600 focus:outline-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <Link to="/" className="flex items-center">
                    <img src={logo} alt="Recipe Platform Logo" className="max-h-15 md:h-15 mr-2" />
                </Link>
            </div>
            <div className={`flex-1 mx-2 md:mx-8 transition-all duration-300 ${isSearchFocused ? 'flex' : 'hidden md:flex'}`}>
                <div className="relative w-full max-w-xl mx-auto">
                    <input
                        type="text"
                        placeholder="Search for recipes, ingredients, or tags..."
                        className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 shadow-inner"
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-2 rounded-full hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
            {!isSearchFocused && (
                <div className="flex items-center">
                    {!isLoggedIn ? (
                        <Link to="/login">
                            <button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-full text-sm md:text-base shadow-md hover:shadow-lg transition-all duration-300">
                                Get Started
                            </button>
                        </Link>
                    ) : (
                        <div className="relative flex items-center space-x-4">
                            {/* NEW: Chat button */}
                            <Link to="/chats" className="flex-shrink-0">
                                <button
                                    title="My Chats"
                                    className="p-2 text-gray-600 hover:text-orange-500 transition-colors duration-200"
                                >
                                    <FaRegCommentDots size={24} />
                                </button>
                            </Link>

                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center focus:outline-none"
                                >
                                    <img
                                        src={profile || "/default-avatar.png"}
                                        alt="Profile"
                                        className="h-10 w-10 md:h-12 md:w-12 rounded-full border-4 border-purple-400 hover:border-purple-500 transition-all duration-300 shadow-md"
                                    />
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-2 z-20 border border-gray-200">
                                        <Link
                                            to="/dashboard"
                                            className="block px-5 py-3 text-md text-gray-800 hover:bg-indigo-500 hover:text-white transition-colors duration-200"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/profile"
                                            className="block px-5 py-3 text-md text-gray-800 hover:bg-indigo-500 hover:text-white transition-colors duration-200"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            className="block w-full text-left px-5 py-3 text-md text-gray-800 hover:bg-red-500 hover:text-white transition-colors duration-200"
                                            onClick={handleLogout}
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
            {isSearchFocused && (
                <button
                    className="ml-4 text-gray-700 font-semibold hover:text-red-500 transition-colors duration-200"
                    onClick={() => setIsSearchFocused(false)}
                >
                    Cancel
                </button>
            )}
        </nav>
    );
};

export default Navbar;