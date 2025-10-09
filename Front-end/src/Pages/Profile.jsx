// Front-end/src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../features/auth/authSlice';
import profile from '../assets/profile.png';

const Profile = () => {
    const dispatch = useDispatch();
    const { user, status, error } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        username: user?.username || '',
        about: user?.about || '',
        cuisine: user?.cuisine || ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                username: user.username || '',
                about: user.about || '',
                cuisine: user.cuisine || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(updateUserProfile(formData));
        if (updateUserProfile.fulfilled.match(resultAction)) {
            alert('Profile updated successfully!');
        } else {
            alert(`Failed to update profile: ${error || 'Unknown error'}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Profile Settings</h1>
                <p className="text-gray-600">Manage your account information and preferences</p>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-800">Personal Information</h2>
                </div>
                
                {error && <div className="text-red-500 text-center p-4">{error}</div>}
                
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                disabled
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-1">
                                Preferred Cuisine
                            </label>
                            <select
                                id="cuisine"
                                name="cuisine"
                                value={formData.cuisine}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Select cuisine</option>
                                <option value="italian">Italian</option>
                                <option value="mexican">Mexican</option>
                                <option value="indian">Indian</option>
                                <option value="chinese">Chinese</option>
                                <option value="thai">Thai</option>
                                <option value="american">American</option>
                                <option value="mediterranean">Mediterranean</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
                            About Me
                        </label>
                        <textarea
                            id="about"
                            name="about"
                            rows={4}
                            value={formData.about}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Tell us about yourself and your cooking experience..."
                        ></textarea>
                    </div>
                    
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-800">Profile Photo</h2>
                </div>
                
                <div className="p-6 flex items-center">
                    <img
                        src={profile || "/default-avatar.png"}
                        alt="Profile"
                        className="h-20 w-20 rounded-full border-2 border-orange-500"
                    />
                    
                    <div className="ml-6">
                        <p className="text-sm text-gray-600 mb-2">Recommended: Square JPG, PNG, or GIF, at least 200x200 pixels</p>
                        <div className="flex space-x-4">
                            <button className="text-sm text-orange-600 hover:text-orange-800 font-medium">
                                Upload New Photo
                            </button>
                            <button className="text-sm text-gray-600 hover:text-gray-800 font-medium">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;