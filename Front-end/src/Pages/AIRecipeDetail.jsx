// Front-end/src/Pages/AIRecipeDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { calculateNutrition, calculateDailyValues } from '../utils/nutritionCalculator';
import { fetchRecipeImage } from '../utils/unsplashService';
import { getFoodPlaceholder } from '../utils/placeholderImages';
import { useSelector } from 'react-redux';

const AIRecipeDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const { isLoggedIn } = useSelector(state => state.auth);

    const [recipe, setRecipe] = useState(null);
    const [activeTab, setActiveTab] = useState('ingredients');
    const [nutritionInfo, setNutritionInfo] = useState(null);
    const [dailyValues, setDailyValues] = useState(null);
    const [checkedIngredients, setCheckedIngredients] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [isLoadingImage, setIsLoadingImage] = useState(true);
    const [scaledServings, setScaledServings] = useState(4);
    const [scalingFactor, setScalingFactor] = useState(1);
    const [shoppingList, setShoppingList] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchAndSetRecipe = async () => {
            setIsLoadingImage(true);
            const recipeDataFromState = location.state?.recipe;
            
            if (recipeDataFromState) {
                setRecipe(recipeDataFromState);
                setScaledServings(recipeDataFromState.servings || 4);
                loadRecipeImage(recipeDataFromState);
                if (recipeDataFromState.ingredients && recipeDataFromState.ingredients.length > 0) {
                    const nutrition = calculateNutrition(recipeDataFromState.ingredients);
                    setNutritionInfo(nutrition);
                    setDailyValues(calculateDailyValues(nutrition));
                }
            } else if (id && id.startsWith('temp-')) {
                const recipeName = decodeURIComponent(id.replace('temp-', ''));
                const basicRecipe = {
                    name: recipeName,
                    title: recipeName,
                    description: "AI-generated recipe suggestion",
                    ingredients: ["1 cup rice", "2 cups water", "1 tsp salt", "1 tbsp oil"],
                    steps: generateAIInstructions(recipeName),
                    cookingTime: "Variable",
                    difficulty: "Medium",
                    tags: ["AI Generated"],
                    servings: 4
                };
                setRecipe(basicRecipe);
                setScaledServings(4);
                loadRecipeImage(basicRecipe);

                const nutrition = calculateNutrition(basicRecipe.ingredients);
                setNutritionInfo(nutrition);
                setDailyValues(calculateDailyValues(nutrition));
            }
        };

        fetchAndSetRecipe();
    }, [id, location.state]);

    useEffect(() => {
        try {
            const savedShoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
            setShoppingList(savedShoppingList);
        } catch (e) {
            console.error("Failed to load shopping list from local storage", e);
            setShoppingList([]);
        }
    }, []);

    const loadRecipeImage = async (recipeData) => {
        if (recipeData.imageUrl) {
            setImageUrl(recipeData.imageUrl);
            setIsLoadingImage(false);
            return;
        }
        
        if (!recipeData.name) return;
        
        setIsLoadingImage(true);
        try {
            const searchTerm = recipeData.name.toLowerCase().includes('paneer') 
                ? `${recipeData.name} indian dish`
                : recipeData.name;
            
            const result = await fetchRecipeImage(searchTerm);
            
            if (result && result.imageUrl) {
                setImageUrl(result.imageUrl);
            } else {
                setImageUrl(getFoodPlaceholder(recipeData.cuisine || recipeData.name));
            }
        } catch (error) {
            console.warn('Error loading image:', error);
            setImageUrl(getFoodPlaceholder(recipeData.cuisine || recipeData.name));
        } finally {
            setIsLoadingImage(false);
        }
    };

    const generateAIInstructions = (recipeName) => {
        const generalSteps = [
            "Gather all ingredients and prepare your workspace. Read through all instructions before starting.",
            "Preheat your cooking equipment (oven, stovetop, etc.) to the appropriate temperature.",
            "Prepare your ingredients by washing, chopping, and measuring as needed.",
            "Begin cooking according to the specific requirements of your recipe.",
            "Monitor cooking progress and adjust heat as necessary.",
            "Taste and season as needed during the cooking process.",
            "Complete cooking and let rest if required before serving.",
            "Serve hot and enjoy your delicious meal!"
        ];
        if (recipeName.toLowerCase().includes('pasta')) {
            return ["Bring a large pot of salted water to boil for the pasta.", "Prepare your sauce ingredients - chop onions, garlic, and any vegetables.", "Heat oil in a large pan and sauté aromatics until fragrant.", "Add pasta to boiling water and cook according to package directions until al dente.", "While pasta cooks, build your sauce in the pan, adding ingredients gradually.", "Reserve 1 cup of pasta cooking water before draining.", "Drain pasta and add to the sauce pan with a splash of pasta water.", "Toss everything together, adding more pasta water if needed for consistency.", "Serve immediately with fresh herbs and cheese if desired."];
        } else if (recipeName.toLowerCase().includes('curry')) {
            return ["Heat oil in a large pot or deep pan over medium heat.", "Add whole spices (if using) and let them bloom for 30 seconds.", "Add onions and cook until golden brown, about 5-7 minutes.", "Add ginger-garlic paste and cook for 1-2 minutes until fragrant.", "Add ground spices and cook for 30 seconds, stirring constantly.", "Add tomatoes and cook until they break down and form a thick base.", "Add your main protein or vegetables and cook until heated through.", "Add liquid (water, coconut milk, or broth) and bring to a simmer.", "Cover and cook until everything is tender and flavors are well combined.", "Taste and adjust seasoning, then garnish and serve with rice or bread."];
        } else if (recipeName.toLowerCase().includes('stir fry')) {
            return ["Prepare all ingredients beforehand - wash, chop, and arrange everything mise en place.", "Heat a wok or large skillet over high heat until smoking.", "Add oil and swirl to coat the pan evenly.", "Add protein first and cook until nearly done, then remove and set aside.", "Add harder vegetables (carrots, broccoli) and stir-fry for 2-3 minutes.", "Add softer vegetables and aromatics, stir-fry for another 1-2 minutes.", "Return protein to the pan and add your sauce mixture.", "Toss everything together quickly until heated through and well coated.", "Serve immediately over rice or noodles while hot and crispy."];
        }
        return generalSteps;
    };

    const handleServingChange = (newServings) => {
        const factor = newServings / (recipe.servings || 4);
        setScaledServings(newServings);
        setScalingFactor(factor);
    };

    const handleIngredientCheck = (ingredient) => {
        let updatedChecked;
        if (checkedIngredients.includes(ingredient)) {
            updatedChecked = checkedIngredients.filter(item => item !== ingredient);
        } else {
            updatedChecked = [...checkedIngredients, ingredient];
        }
        setCheckedIngredients(updatedChecked);
    };

    const handleAddToList = () => {
        if (!isLoggedIn) {
            alert('Please login to add to your shopping list');
            return;
        }
        const existingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
        const newList = [...new Set([...existingList, ...checkedIngredients])];
        localStorage.setItem('shoppingList', JSON.stringify(newList));
        setShoppingList(newList);
        alert('Selected ingredients added to your shopping list!');
    };

    const handleShoppingListCheck = (item) => {
        const updatedList = shoppingList.filter(ingredient => ingredient !== item);
        setShoppingList(updatedList);
        localStorage.setItem('shoppingList', JSON.stringify(updatedList));
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            alert('Please login to comment');
            return;
        }
        // TODO: Implement actual comment submission logic for AI recipes
        console.log("Comment submitted for AI recipe:", comment);
        setComment('');
    };

    if (!recipe) {
        return (
            <div className="text-center py-10">
                <svg className="animate-spin h-10 w-10 text-orange-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-gray-600">Loading recipe details...</p>
            </div>
        );
    }
    
    // Mock comments for AI recipes
    const comments = [
        { user: "AI_Tester_1", avatar: "/default-avatar.png", text: "The instructions were clear and easy to follow. A great quick meal!", time: "1 day ago", tried: true },
        { user: "AI_Fan_2", avatar: "/default-avatar.png", text: "I tried this recipe with tofu instead of chicken and it was delicious!", time: "3 days ago", tried: true }
    ];

    const tabs = ['Ingredients', 'Instructions', 'Nutrition', 'Scaling', 'Comments'];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                {/* Image Section */}
                <div className="relative pb-[56.25%] h-0">
                    {isLoadingImage && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <div className="animate-pulse flex space-x-2">
                                <div className="h-2 w-2 bg-orange-400 rounded-full"></div>
                                <div className="h-2 w-2 bg-orange-400 rounded-full"></div>
                                <div className="h-2 w-2 bg-orange-400 rounded-full"></div>
                            </div>
                        </div>
                    )}
                    <img 
                        src={imageUrl || getFoodPlaceholder(recipe.cuisine || recipe.name)} 
                        alt={recipe.title || recipe.name} 
                        className="absolute h-full w-full object-cover transition-opacity duration-300"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getFoodPlaceholder(recipe.cuisine || recipe.name);
                        }}
                        style={{ opacity: isLoadingImage ? 0 : 1 }}
                        onLoad={() => setIsLoadingImage(false)}
                    />
                    
                    <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                            AI Generated
                        </span>
                    </div>
                </div>
                
                <div className="p-6">
                    <div className="flex flex-wrap items-start justify-between mb-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{recipe.title || recipe.name}</h1>
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full mr-2 bg-orange-500 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <span className="text-gray-700">by AI Recipe Assistant</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center text-sm text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-orange-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                            Time: {recipe.cookingTime || 'Variable'}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-orange-500" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                            Serves: {scaledServings}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-orange-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            Difficulty: {recipe.difficulty || 'Medium'}
                        </div>
                    </div>
                    
                    {recipe.description && (
                        <p className="text-gray-600 mb-6">{recipe.description}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                        {(recipe.tags || []).map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                    
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="flex -mb-px">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    className={`py-3 px-6 text-sm font-medium border-b-2 ${
                                        activeTab === tab.toLowerCase()
                                            ? 'border-orange-500 text-orange-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                    onClick={() => setActiveTab(tab.toLowerCase())}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>
                    
                    {activeTab === 'ingredients' && (
                        <div>
                            <ul className="space-y-2">
                                {(recipe.ingredients || []).map((ingredient, index) => (
                                    <li key={index} className="flex items-start">
                                        <label className="flex items-center cursor-pointer w-full">
                                            <input
                                                type="checkbox"
                                                checked={checkedIngredients.includes(ingredient)}
                                                onChange={() => handleIngredientCheck(ingredient)}
                                                className="h-5 w-5 text-orange-600 rounded focus:ring-orange-500 border-gray-300"
                                            />
                                            <span className={`ml-3 ${checkedIngredients.includes(ingredient) ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                                {ingredient}
                                            </span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                            
                            <button
                                onClick={handleAddToList}
                                className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={checkedIngredients.length === 0}
                                title={checkedIngredients.length === 0 ? "Select ingredients to add" : "Add to shopping list"}
                            >
                                Add to Shopping List
                            </button>
                            
                            {shoppingList.length > 0 && (
                                <div className="mt-8 pt-4 border-t border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">🛒 Your Shopping List</h3>
                                    <ul className="space-y-2">
                                        {shoppingList.map((item, index) => (
                                            <li key={index} className="flex items-center p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-150">
                                                <input
                                                    type="checkbox"
                                                    checked={shoppingList.includes(item)}
                                                    onChange={() => handleShoppingListCheck(item)}
                                                    className="h-5 w-5 text-green-600 rounded focus:ring-green-500 border-gray-300"
                                                />
                                                <span className="ml-3 text-gray-800">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {activeTab === 'instructions' && (
                        <div>
                            <div className="mb-6">
                                <div className="flex items-center mb-4">
                                    <div className="flex items-center text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        AI-Generated Instructions
                                    </div>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <div className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm text-blue-800 font-medium">AI Cooking Assistant</p>
                                            <p className="text-sm text-blue-700 mt-1">
                                                These instructions are AI-generated based on common cooking techniques for this type of recipe. Always use your judgment and adjust based on your preferences and equipment.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <ol className="space-y-4">
                                {(recipe.steps || []).map((step, index) => (
                                    <li key={index} className="flex">
                                        <span className="bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full h-8 w-8 flex items-center justify-center mt-1 mr-4 flex-shrink-0 text-sm font-medium">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-gray-800 leading-relaxed">{step}</p>
                                            {index === 0 && (<div className="mt-2 text-xs text-gray-500">💡 Pro tip: Take your time with preparation - it makes cooking much easier!</div>)}
                                            {step.toLowerCase().includes('heat') && (<div className="mt-2 text-xs text-gray-500">🔥 Watch the heat level to avoid burning</div>)}
                                            {step.toLowerCase().includes('season') && (<div className="mt-2 text-xs text-gray-500">🧂 Taste as you go and adjust seasoning to your preference</div>)}
                                        </div>
                                    </li>
                                ))}
                            </ol>
                            
                            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                                <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Smart Cooking Timer
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">Set timers for each step to ensure perfect results</p>
                                <button className="flex items-center text-green-600 hover:text-green-800 font-medium">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    Start Cooking Timer
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'scaling' && (
                        <div>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                    Recipe Scaling Calculator
                                </h3>
                                <p className="text-gray-600 text-sm">Easily adjust serving sizes and ingredient measurements for your needs</p>
                            </div>

                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Adjust Servings</label>
                                        <p className="text-xs text-gray-500">Original recipe serves {recipe.servings || 4}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => handleServingChange(Math.max(1, scaledServings - 1))}
                                            className="w-8 h-8 rounded-full bg-orange-500 text-white hover:bg-orange-600 flex items-center justify-center"
                                        >
                                            -
                                        </button>
                                        <span className="text-xl font-semibold text-gray-800 w-12 text-center">{scaledServings}</span>
                                        <button
                                            onClick={() => handleServingChange(scaledServings + 1)}
                                            className="w-8 h-8 rounded-full bg-orange-500 text-white hover:bg-orange-600 flex items-center justify-center"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {[1, 2, 4, 6, 8, 12].map((serving) => (
                                        <button
                                            key={serving}
                                            onClick={() => handleServingChange(serving)}
                                            className={`px-3 py-1 text-sm rounded-md ${
                                                scaledServings === serving
                                                    ? 'bg-orange-500 text-white'
                                                    : 'bg-white text-orange-600 border border-orange-300 hover:bg-orange-50'
                                            }`}
                                        >
                                            {serving} {serving === 1 ? 'serving' : 'servings'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                                <h4 className="font-medium text-gray-800 mb-4">Scaled Ingredients</h4>
                                <div className="space-y-3">
                                    {(recipe.ingredients || []).map((ingredient, index) => (
                                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                            <span className="text-gray-800">{ingredient}</span>
                                            {scalingFactor !== 1 && (
                                                <span className="text-sm text-orange-600 font-medium">
                                                    ×{scalingFactor.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Cooking Time Guidance
                                </h4>
                                <div className="space-y-2 text-sm text-blue-800">
                                    {scalingFactor > 1.5 && (
                                        <div className="flex items-start">
                                            <span className="text-blue-500 mr-2">•</span>
                                            <span>For larger portions, cooking time may increase by 10-25%. Check doneness regularly.</span>
                                        </div>
                                    )}
                                    {scalingFactor < 0.7 && (
                                        <div className="flex items-start">
                                            <span className="text-blue-500 mr-2">•</span>
                                            <span>For smaller portions, reduce cooking time by 15-30%. Monitor closely to prevent overcooking.</span>
                                        </div>
                                    )}
                                    <div className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        <span>Seasoning amounts scale proportionally, but taste and adjust as needed.</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        <span>Pan/pot size may need adjustment for significantly different quantities.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'nutrition' && (
                        <div>
                            {nutritionInfo ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-orange-700">{nutritionInfo.calories}</div>
                                            <div className="text-sm text-orange-600">Calories</div>
                                            <div className="text-xs text-gray-600 mt-1">{dailyValues?.calories || 0}% DV</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-blue-700">{nutritionInfo.protein}g</div>
                                            <div className="text-sm text-blue-600">Protein</div>
                                            <div className="text-xs text-gray-600 mt-1">{dailyValues?.protein || 0}% DV</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-green-700">{nutritionInfo.carbs}g</div>
                                            <div className="text-sm text-green-600">Carbs</div>
                                            <div className="text-xs text-gray-600 mt-1">{dailyValues?.carbs || 0}% DV</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-purple-700">{nutritionInfo.fat}g</div>
                                            <div className="text-sm text-purple-600">Fat</div>
                                            <div className="text-xs text-gray-600 mt-1">{dailyValues?.fat || 0}% DV</div>
                                        </div>
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-800">Detailed Nutritional Analysis</h3>
                                            <p className="text-sm text-gray-600">Per serving • Based on recipe ingredients</p>
                                        </div>
                                        
                                        <div className="p-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                                                        <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                                                        Macronutrients
                                                    </h4>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between"><span className="text-gray-700">Total Calories</span><div className="text-right"><span className="font-medium">{nutritionInfo.calories}</span><div className="text-xs text-gray-500">{dailyValues?.calories || 0}% DV</div></div></div>
                                                        <div className="flex items-center justify-between"><span className="text-gray-700">Protein</span><div className="text-right"><span className="font-medium">{nutritionInfo.protein}g</span><div className="text-xs text-gray-500">{dailyValues?.protein || 0}% DV</div></div></div>
                                                        <div className="flex items-center justify-between"><span className="text-gray-700">Total Carbohydrates</span><div className="text-right"><span className="font-medium">{nutritionInfo.carbs}g</span><div className="text-xs text-gray-500">{dailyValues?.carbs || 0}% DV</div></div></div>
                                                        <div className="flex items-center justify-between pl-4"><span className="text-gray-600">Dietary Fiber</span><div className="text-right"><span className="font-medium">{nutritionInfo.fiber}g</span><div className="text-xs text-gray-500">{dailyValues?.fiber || 0}% DV</div></div></div>
                                                        <div className="flex items-center justify-between pl-4"><span className="text-gray-600">Total Sugars</span><div className="text-right"><span className="font-medium">{nutritionInfo.sugar}g</span></div></div>
                                                        <div className="flex items-center justify-between"><span className="text-gray-700">Total Fat</span><div className="text-right"><span className="font-medium">{nutritionInfo.fat}g</span><div className="text-xs text-gray-500">{dailyValues?.fat || 0}% DV</div></div></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                                                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                                        Vitamins & Minerals
                                                    </h4>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between"><span className="text-gray-700">Vitamin A</span><div className="text-right"><span className="font-medium">{nutritionInfo.vitaminA}µg</span><div className="text-xs text-gray-500">{dailyValues?.vitaminA || 0}% DV</div></div></div>
                                                        <div className="flex items-center justify-between"><span className="text-gray-700">Vitamin C</span><div className="text-right"><span className="font-medium">{nutritionInfo.vitaminC}mg</span><div className="text-xs text-gray-500">{dailyValues?.vitaminC || 0}% DV</div></div></div>
                                                        <div className="flex items-center justify-between"><span className="text-gray-700">Calcium</span><div className="text-right"><span className="font-medium">{nutritionInfo.calcium}mg</span><div className="text-xs text-gray-500">{dailyValues?.calcium || 0}% DV</div></div></div>
                                                        <div className="flex items-center justify-between"><span className="text-gray-700">Iron</span><div className="text-right"><span className="font-medium">{nutritionInfo.iron}mg</span><div className="text-xs text-gray-500">{dailyValues?.iron || 0}% DV</div></div></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-6 pt-6 border-t border-gray-200">
                                                <h4 className="font-medium text-gray-800 mb-3">Nutritional Highlights</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {nutritionInfo.protein > 20 && (<span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">High Protein</span>)}
                                                    {nutritionInfo.fiber > 5 && (<span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">High Fiber</span>)}
                                                    {nutritionInfo.vitaminA > 300 && (<span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">Rich in Vitamin A</span>)}
                                                    {nutritionInfo.vitaminC > 20 && (<span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">Rich in Vitamin C</span>)}
                                                    {nutritionInfo.iron > 3 && (<span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">Good Iron Source</span>)}
                                                    {nutritionInfo.calcium > 100 && (<span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">Good Calcium Source</span>)}
                                                </div>
                                            </div>
                                            <div className="mt-6 pt-4 border-t border-gray-200">
                                                <p className="text-xs text-gray-500">* Nutritional values are estimates based on ingredient analysis and may vary depending on preparation methods and ingredient brands. Daily Value (DV) percentages are based on a 2000-calorie diet.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Nutritional Data Available</h3>
                                    <p className="text-gray-600">Unable to calculate nutritional information for this recipe.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'comments' && (
                        <div>
                            <div className="mb-6">
                                <h3 className="font-medium text-gray-800 mb-3">Community Tips & Reviews</h3>
                                <form onSubmit={handleCommentSubmit} className="mb-6">
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2"
                                        rows={3}
                                        placeholder="Share your experience or modifications..."
                                        disabled={!isLoggedIn}
                                    ></textarea>
                                    <div className="flex justify-between items-center">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                                disabled={!isLoggedIn}
                                            />
                                            <span className="ml-2 text-sm text-gray-700">I tried this recipe</span>
                                        </label>
                                        <button
                                            type="submit"
                                            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!isLoggedIn || !comment.trim()}
                                        >
                                            Post Comment
                                        </button>
                                    </div>
                                </form>
                                <div className="space-y-4">
                                    {comments.map((comment, index) => (
                                        <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                                            <div className="flex items-start">
                                                <img src={comment.avatar} alt={comment.user} className="h-8 w-8 rounded-full mr-3" />
                                                <div>
                                                    <div className="flex items-center">
                                                        <h4 className="font-medium text-gray-800">{comment.user}</h4>
                                                        {comment.tried && (<span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>I tried this!</span>)}
                                                    </div>
                                                    <p className="text-gray-600 text-sm">{comment.time}</p>
                                                    <p className="mt-2 text-gray-800">{comment.text}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIRecipeDetail;