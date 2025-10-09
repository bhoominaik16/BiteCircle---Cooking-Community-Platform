// Front-end/src/pages/Challenges.jsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Challenges = () => {
    const { isLoggedIn } = useSelector(state => state.auth);
    const navigate = useNavigate();
    
    // CORRECT: Call useState at the top level, before any conditional logic.
    const [activeTab, setActiveTab] = useState('current');

    useEffect(() => {
        if (!isLoggedIn) {
            alert('Please login to access Challenges & Events.');
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) {
        return null;
    }
    
    const currentChallenges = [
        {
            id: 1,
            title: "Sunday Brunch Special Challenge",
            image: "/brunch-challenge.jpg",
            description: "Create the ultimate brunch recipe that's perfect for a lazy Sunday morning!",
            endDate: "2025-08-31",
            participants: 0,
            prize: "Featured on homepage + $200 cooking equipment gift card",
            startDate: "2025-08-24 10:00:00"
        },
        {
            id: 2,
            title: "15-Minute Breakfast Challenge",
            image: "/breakfast-challenge.jpg",
            description: "Create a delicious and nutritious breakfast in 15 minutes or less!",
            endDate: "2025-06-15",
            participants: 243,
            prize: "Featured on homepage + $100 gift card"
        },
        {
            id: 3,
            title: "Plant-Based Dinner Challenge",
            image: "/vegan-challenge.jpg",
            description: "Show us your best vegan dinner recipe that even meat-lovers would enjoy!",
            endDate: "2025-06-22",
            participants: 187,
            prize: "Professional cookware set"
        }
    ];
    
    const pastChallenges = [
        {
            id: 4,
            title: "One-Pot Wonder Challenge",
            image: "/onepot-challenge.jpg",
            description: "Create a delicious meal using only one pot or pan!",
            endDate: "2025-05-30",
            winner: "Chef Emma",
            winnerRecipe: "Creamy Sun-Dried Tomato Pasta"
        }
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Challenges & Events</h1>
                <p className="text-gray-600">Join community challenges and showcase your cooking skills</p>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        {['Current Challenges', 'Past Challenges'].map((tab) => (
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
                    {activeTab === 'current_challenges' && (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {currentChallenges.map(challenge => (
                                    <div key={challenge.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="h-48 bg-gray-200 relative">
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                                Challenge Image
                                            </div>
                                            {challenge.startDate && new Date(challenge.startDate) > new Date() && (
                                                <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                    Starting Soon
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg text-gray-800 mb-2">{challenge.title}</h3>
                                            <p className="text-gray-600 mb-4">{challenge.description}</p>
                                            
                                            <div className="flex items-center text-sm text-gray-500 mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {challenge.startDate ? `Starts: ${challenge.startDate.split(' ')[0]}` : `Ends: ${challenge.endDate}`}
                                            </div>
                                            
                                            <div className="flex items-center text-sm text-gray-500 mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                {challenge.participants} participants
                                            </div>
                                            
                                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Prize: {challenge.prize}
                                            </div>
                                            
                                            <button
                                                className={`w-full font-medium py-2 px-4 rounded-md ${
                                                    challenge.startDate && new Date(challenge.startDate) > new Date()
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                                                }`}
                                                disabled={challenge.startDate && new Date(challenge.startDate) > new Date()}
                                            >
                                                {challenge.startDate && new Date(challenge.startDate) > new Date()
                                                    ? 'Starting Soon'
                                                    : 'Join Challenge'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="text-center">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">How Challenges Work</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-orange-50 rounded-lg">
                                        <div className="h-12 w-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3 mx-auto">
                                            <span className="font-bold">1</span>
                                        </div>
                                        <h4 className="font-medium text-gray-800 mb-2">Join a Challenge</h4>
                                        <p className="text-sm text-gray-600">Select a challenge that interests you and click "Join Challenge"</p>
                                    </div>
                                    
                                    <div className="p-4 bg-orange-50 rounded-lg">
                                        <div className="h-12 w-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3 mx-auto">
                                            <span className="font-bold">2</span>
                                        </div>
                                        <h4 className="font-medium text-gray-800 mb-2">Create & Submit</h4>
                                        <p className="text-sm text-gray-600">Create your recipe following the challenge guidelines and submit it</p>
                                    </div>
                                    
                                    <div className="p-4 bg-orange-50 rounded-lg">
                                        <div className="h-12 w-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3 mx-auto">
                                            <span className="font-bold">3</span>
                                        </div>
                                        <h4 className="font-medium text-gray-800 mb-2">Vote & Win</h4>
                                        <p className="text-sm text-gray-600">Community members vote for their favorites, and winners receive prizes!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'past_challenges' && (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pastChallenges.map(challenge => (
                                    <div key={challenge.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="h-48 bg-gray-200 relative">
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                                Challenge Image
                                            </div>
                                        </div>
                                        
                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg text-gray-800 mb-2">{challenge.title}</h3>
                                            <p className="text-gray-600 mb-4">{challenge.description}</p>
                                            
                                            <div className="bg-green-50 p-3 rounded-lg mb-4">
                                                <h4 className="font-medium text-green-800 mb-1">Winner: {challenge.winner}</h4>
                                                <p className="text-sm text-green-700">Winning Recipe: {challenge.winnerRecipe}</p>
                                            </div>
                                            
                                            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md">
                                                View Submissions
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Challenges;