import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { addIngredient, removeIngredient, toggleDietary } from '../features/filters/filtersSlice';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector(state => state.auth);
    const { ingredients: userIngredients, dietary: dietaryPreferences } = useSelector(state => state.filters);
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [searchTerm, setSearchTerm] = useState('');
    
    const dietOptions = ['Vegetarian', 'Vegan', 'Keto', 'Gluten-Free', 'Dairy-Free'];

    function calculateTimeLeft() {
        const targetDate = new Date('August 24, 2025 10:00:00');
        const now = new Date();
        const difference = targetDate - now;
    
        if (difference <= 0) {
            return { expired: true };
        }
    
        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        
        return () => clearInterval(timer);
    }, []);

    const handleProtectedClick = (itemName) => {
        // NOTE: Replace this alert with a custom UI/Modal for better UX
        alert(`Please login first to access ${itemName}`);
        setSidebarOpen(false);
    };

    const handleAddIngredient = () => {
        if (searchTerm.trim() && !userIngredients.includes(searchTerm.trim())) {
            dispatch(addIngredient(searchTerm.trim()));
            setSearchTerm('');
        }
    };
    
    const handleRemoveIngredient = (ingredientToRemove) => {
        dispatch(removeIngredient(ingredientToRemove));
    };

    const handleDietaryChange = (diet) => {
        dispatch(toggleDietary(diet));
    };

    const sidebarItems = [
        {
            name: "Meal Planner",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
            ),
            path: "/meal-planner",
            enabled: isLoggedIn,
        },
        {
            name: "Challenges & Events",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
            ),
            path: "/challenges",
            enabled: isLoggedIn,
        },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`
                fixed md:static top-0 left-0 h-screen w-64 bg-gradient-to-b from-gray-50 to-white z-50 transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                flex flex-col border-r border-gray-200 shadow-2xl md:shadow-none
            `}>
                <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Filters & Tools</h2>
                    <button
                        className="md:hidden text-gray-600 hover:text-red-500 transition-colors duration-200"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                
                {/* Scrollable content area */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4">
                        {/* Navigation Items */}
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Navigation</h3>
                            <ul className="space-y-2">
                                {sidebarItems.map((item, index) => (
                                    <li key={index}>
                                        {item.enabled ? (
                                            <Link
                                                to={item.path}
                                                className="flex items-center px-3 py-2.5 rounded-lg text-md font-medium text-gray-700 hover:bg-purple-500 hover:text-white transition-all duration-200 group"
                                                onClick={() => setSidebarOpen(false)}
                                            >
                                                <span className="mr-4 text-gray-500 group-hover:text-white transition-colors duration-200">{item.icon}</span>
                                                {item.name}
                                            </Link>
                                        ) : (
                                            <button
                                                className="flex items-center px-3 py-2.5 rounded-lg text-md font-medium text-gray-400 cursor-not-allowed w-full text-left"
                                                onClick={() => handleProtectedClick(item.name)}
                                            >
                                                <span className="mr-4">{item.icon}</span>
                                                {item.name}
                                                <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Login</span>
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Countdown Timer */}
                        <div className="mb-8 bg-gradient-to-r from-yellow-300 to-orange-400 p-4 rounded-lg shadow-lg border border-orange-200">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 text-center">Next Challenge Starts In</h3>
                            {timeLeft.expired ? (
                                <p className="text-center text-white font-semibold">Challenge has started!</p>
                            ) : (
                                <div className="grid grid-cols-4 gap-2 text-center text-white">
                                    <div className="bg-white bg-opacity-20 p-2 rounded-lg shadow-md">
                                        <div className="text-2xl font-bold">{timeLeft.days}</div>
                                        <div className="text-xs opacity-80">Days</div>
                                    </div>
                                    <div className="bg-white bg-opacity-20 p-2 rounded-lg shadow-md">
                                        <div className="text-2xl font-bold">{timeLeft.hours}</div>
                                        <div className="text-xs opacity-80">Hours</div>
                                    </div>
                                    <div className="bg-white bg-opacity-20 p-2 rounded-lg shadow-md">
                                        <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                                        <div className="text-xs opacity-80">Mins</div>
                                    </div>
                                    <div className="bg-white bg-opacity-20 p-2 rounded-lg shadow-md">
                                        <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                                        <div className="text-xs opacity-80">Secs</div>
                                    </div>
                                </div>
                            )}
                            <p className="text-xs text-white mt-3 text-center opacity-90">Sunday, August 24th at 10:00 AM</p>
                        </div>
                        
                        {/* Search and Filter Section (Replaces AI Button) */}
                        <div className="p-0 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="p-4 border-b border-gray-100">
                                <h3 className="text-base font-bold text-gray-800">Search Community Recipes</h3>
                                <p className="text-sm text-gray-500">Filter based on ingredients and preferences.</p>
                            </div>

                            {/* Ingredient Search */}
                            <div className="mb-4 px-4 pt-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Ingredients</h3>
                                <div className="space-y-3">
                                    <div className="relative flex items-center">
                                        <input
                                            type="text"
                                            placeholder="Enter ingredients to filter..."
                                            value={searchTerm}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault(); 
                                                    handleAddIngredient();
                                                }
                                            }}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
                                        />
                                        <button
                                            onClick={handleAddIngredient}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-200"
                                            title="Add Ingredient"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    <div className={userIngredients.length === 0 ? 'hidden' : "flex flex-wrap gap-2 pt-1 min-h-[30px]"}>
                                        {userIngredients.map((ingredient, index) => (
                                            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                                                {ingredient}
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleRemoveIngredient(ingredient)}
                                                    className="ml-2 flex-shrink-0 text-orange-800 hover:text-red-600 transition-colors duration-200"
                                                >
                                                    <svg className="h-3 w-3" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                                        <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                                    </svg>
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Dietary Filters */}
                            <div className="px-4 pb-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Dietary Preferences</h3>
                                <div className="space-y-3">
                                    {dietOptions.map((diet, index) => (
                                        <label key={index} className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={dietaryPreferences.includes(diet)}
                                                onChange={() => handleDietaryChange(diet)}
                                                className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded-md shadow-sm"
                                            />
                                            <span className="ml-3 text-md text-gray-700">{diet}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
