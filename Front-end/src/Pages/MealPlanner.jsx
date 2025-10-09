import React, { useState, useEffect } from 'react';
import { Calendar, Plus, ShoppingBag, Clock, ChefHat, Coffee, Utensils, Cookie } from 'lucide-react';

const MealPlanner = () => {
    // Simulating Redux state and navigation for demo purposes
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [selectedMeals, setSelectedMeals] = useState({});
    const [hoveredCell, setHoveredCell] = useState(null);

    // Simulating your original useEffect logic
    useEffect(() => {
        if (!isLoggedIn) {
            alert('Please login to access the Meal Planner.');
            // In your real app: navigate('/login');
            console.log('Would navigate to login page');
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return null;
    }

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
    
    const dayColors = [
        'from-orange-400 to-red-500',
        'from-yellow-400 to-orange-500', 
        'from-green-400 to-teal-500',
        'from-blue-400 to-indigo-500',
        'from-purple-400 to-pink-500',
        'from-pink-400 to-rose-500',
        'from-indigo-400 to-purple-500'
    ];

    const mealTypeData = {
        'Breakfast': { icon: Coffee, color: 'from-yellow-400 to-orange-400', bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50' },
        'Lunch': { icon: Utensils, color: 'from-green-400 to-teal-400', bgColor: 'bg-gradient-to-br from-green-50 to-teal-50' },
        'Dinner': { icon: ChefHat, color: 'from-purple-400 to-indigo-400', bgColor: 'bg-gradient-to-br from-purple-50 to-indigo-50' },
        'Snacks': { icon: Cookie, color: 'from-pink-400 to-rose-400', bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50' }
    };

    const addRecipe = (day, mealType) => {
        // This would normally open a recipe selection modal
        const key = `${day}-${mealType}`;
        setSelectedMeals(prev => ({
            ...prev,
            [key]: `Sample ${mealType} Recipe`
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <div className="mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Meal Planner</h1>
                            <p className="text-orange-100">Plan your meals for the week and generate a shopping list</p>
                        </div>
                    </div>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="flex items-center gap-3">
                                <ChefHat className="w-6 h-6 text-yellow-300" />
                                <div>
                                    <p className="text-white/80 text-sm">Recipes Planned</p>
                                    <p className="text-2xl font-bold">{Object.keys(selectedMeals).length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="flex items-center gap-3">
                                <Clock className="w-6 h-6 text-green-300" />
                                <div>
                                    <p className="text-white/80 text-sm">Week Progress</p>
                                    <p className="text-2xl font-bold">{Math.round((Object.keys(selectedMeals).length / 28) * 100)}%</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-6 h-6 text-blue-300" />
                                <div>
                                    <p className="text-white/80 text-sm">Shopping Items</p>
                                    <p className="text-2xl font-bold">0</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Weekly Plan Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 transform hover:scale-[1.01] transition-all duration-300">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-red-500">
                        <h2 className="text-lg font-medium text-white flex items-center gap-3">
                            Weekly Plan
                        </h2>
                    </div>
                    
                    <div className="p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 border"></th>
                                        {daysOfWeek.map((day, index) => (
                                            <th key={day} className={`px-4 py-2 text-center text-sm font-medium text-white bg-gradient-to-br ${dayColors[index]} border rounded-lg`}>
                                                {day}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {mealTypes.map(mealType => {
                                        const mealData = mealTypeData[mealType];
                                        const IconComponent = mealData.icon;
                                        return (
                                            <tr key={mealType}>
                                                <td className={`px-4 py-3 text-sm font-medium text-gray-700 ${mealData.bgColor} border rounded-lg`}>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`p-1 rounded-lg bg-gradient-to-br ${mealData.color} text-white`}>
                                                            <IconComponent className="w-4 h-4" />
                                                        </div>
                                                        {mealType}
                                                    </div>
                                                </td>
                                                {daysOfWeek.map((day, dayIndex) => {
                                                    const cellKey = `${day}-${mealType}`;
                                                    const hasRecipe = selectedMeals[cellKey];
                                                    const isHovered = hoveredCell === cellKey;
                                                    
                                                    return (
                                                        <td key={cellKey} className="px-4 py-3 border border-gray-200">
                                                            <div 
                                                                className={`text-center text-sm cursor-pointer p-2 rounded-xl transition-all duration-300 ${hasRecipe ? 'bg-gradient-to-br from-green-50 to-emerald-50 text-green-700 font-medium' : 'text-gray-500 hover:bg-gradient-to-br hover:from-orange-50 hover:to-pink-50 hover:text-gray-700'} ${isHovered ? 'scale-105 shadow-lg' : ''}`}
                                                                onMouseEnter={() => setHoveredCell(cellKey)}
                                                                onMouseLeave={() => setHoveredCell(null)}
                                                                onClick={() => addRecipe(day, mealType)}
                                                            >
                                                                {hasRecipe ? (
                                                                    <div>
                                                                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full mb-1">
                                                                            ✓ Added
                                                                        </div>
                                                                        <div className="text-xs">{hasRecipe}</div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center justify-center gap-1">
                                                                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${dayColors[dayIndex]} flex items-center justify-center text-white transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
                                                                            <Plus className="w-3 h-3" />
                                                                        </div>
                                                                        <span className="text-xs">+ Add Recipe</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                {/* Shopping List Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-indigo-500">
                        <h2 className="text-lg font-medium text-white">Shopping List</h2>
                    </div>
                    
                    <div className="p-6">
                        <div className="mb-4">
                            <p className="text-gray-600">Your shopping list will appear here once you add recipes to your meal plan.</p>
                        </div>
                        
                        <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100 hover:from-orange-50 hover:to-pink-50 transition-all duration-300">
                            <div className="bg-gradient-to-br from-orange-400 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <ShoppingBag className="w-8 h-8 text-white" />
                            </div>
                            <p className="text-gray-600 mb-4">No items in your shopping list yet</p>
                            <button className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-2 px-4 rounded-md transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                                Generate Shopping List
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MealPlanner;