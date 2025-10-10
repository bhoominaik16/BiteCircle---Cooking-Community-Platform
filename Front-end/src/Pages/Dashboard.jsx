// Front-end/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../features/dashboard/dashboardSlice';
import { createCollection } from '../features/collections/collectionsSlice';
import RecipeCard from '../Components/RecipeCard';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { 
        stats = {}, 
        recentActivities = [], 
        myCookbook = [], 
        likedRecipes = [], 
        collections = [], 
        status, 
        error 
    } = useSelector(state => state.dashboard);
    
    const [activeTab, setActiveTab] = useState('overview');
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');

    useEffect(() => {
        if (user) {
            dispatch(fetchDashboardData());
        }
    }, [dispatch, user]);
    
    const handleCreateCollection = async (e) => {
        e.preventDefault();
        if (newCollectionName.trim()) {
            await dispatch(createCollection(newCollectionName));
            setShowCollectionModal(false);
            setNewCollectionName('');
            // No need to alert, Redux will update the state
        }
    };

    if (!user) {
        return (
            <div className="max-w-6xl mx-auto text-center py-20">
                <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
                <p className="mt-4 text-gray-600">Please log in to view your dashboard.</p>
                <Link to="/login" className="mt-6 inline-block bg-orange-500 text-white font-medium py-2 px-6 rounded-md">
                    Log In
                </Link>
            </div>
        );
    }

    if (status === 'loading') {
        return (
            <div className="text-center py-10">
                <svg className="animate-spin h-10 w-10 text-orange-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
        );
    }

    if (status === 'failed') {
        return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="max-w-6xl mx-auto">
            {showCollectionModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Create New Collection</h3>
                        <form onSubmit={handleCreateCollection}>
                            <input
                                type="text"
                                value={newCollectionName}
                                onChange={(e) => setNewCollectionName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
                                placeholder="Enter collection name"
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCollectionModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md border border-gray-300 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white rounded-md bg-orange-500 hover:bg-orange-600"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name || 'Chef'}!</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Recipes Saved</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.recipesSaved}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Recipes Created</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.recipesCreated}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Challenges Joined</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.challengesJoined}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Community Points</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.communityPoints}</p>
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        {['Overview', 'My Cookbook', 'Collections', 'Liked Recipes'].map((tab) => (
                            <button
                                key={tab}
                                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                                    activeTab === tab.toLowerCase().replace(' ', '_')
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                                onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '_'))}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
                
                <div className="p-6">
                    {activeTab === 'overview' && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Activity</h3>
                            <ul className="divide-y divide-gray-200">
                                {recentActivities.length > 0 ? (
                                    recentActivities.map((activity, index) => (
                                        <li key={index} className="py-3">
                                            <div className="flex space-x-3">
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm text-gray-800">
                                                            <span className="font-medium">{activity.action}</span>{' '}
                                                            <span className="text-orange-600">{activity.recipe}</span>
                                                        </p>
                                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-gray-600">No recent activity found.</p>
                                )}
                            </ul>
                        </div>
                    )}
                    
                    {activeTab === 'my_cookbook' && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Your Uploaded Recipes</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {myCookbook.length > 0 ? (
                                    myCookbook.map(recipe => (
                                        <RecipeCard key={recipe._id} recipe={recipe} />
                                    ))
                                ) : (
                                    <p className="text-gray-600 col-span-full">You haven't uploaded any recipes yet.</p>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'collections' && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Your Collections</h3>
                            {collections.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {collections.map(collection => (
                                        <Link key={collection._id} to={`/collections/${collection._id}`} className="block border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                                            </svg>
                                            <p className="font-medium text-gray-800">{collection.name}</p>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">You haven't created any collections yet.</p>
                            )}
                            <button onClick={() => setShowCollectionModal(true)} className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md">
                                Create New Collection
                            </button>
                        </div>
                    )}
                    
                    {activeTab === 'liked_recipes' && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Recipes You've Liked</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {likedRecipes.length > 0 ? (
                                    likedRecipes.map(likedItem => (
                                        <RecipeCard key={likedItem.recipe._id} recipe={likedItem.recipe} />
                                    ))
                                ) : (
                                    <p className="text-gray-600 col-span-full">You haven't liked any recipes yet.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/upload" className="bg-orange-50 p-4 rounded-lg text-center hover:bg-orange-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <p className="font-medium text-orange-700">Upload Recipe</p>
                    </Link>
                    
                    <Link to="/meal-planner" className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="font-medium text-green-700">Meal Planner</p>
                    </Link>
                    
                    <Link to="/challenges" className="bg-purple-50 p-4 rounded-lg text-center hover:bg-purple-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-medium text-purple-700">Join Challenges</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;