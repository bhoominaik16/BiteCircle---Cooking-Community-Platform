// Front-end/src/Components/AIRecipeSuggest.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fetchRecipeImage } from '../utils/unsplashService';
import { getFoodPlaceholder } from '../utils/placeholderImages';

const RecipeSuggestionCard = ({ recipe }) => {
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [imageRetries, setImageRetries] = useState(0);
    
    // Extract prep and cook times from cooking time string
    let prepTime = "5 mins";
    let cookTime = "10 mins";
    
    if (recipe.cookingTime) {
        const timeMatch = recipe.cookingTime.match(/(\d+)\s*mins?/);
        if (timeMatch) {
            const totalTime = parseInt(timeMatch[1]);
            prepTime = `${Math.max(1, Math.floor(totalTime * 0.3))} mins`;
            cookTime = `${Math.max(1, Math.floor(totalTime * 0.7))} mins`;
        }
    }
    
    // Create tags from ingredients and cuisine
    const mainTag = recipe.cuisine?.toLowerCase() || "recipe";
    
    // Process ingredient tags for display and image search
    const [ingredientTags, setIngredientTags] = useState([]);
    
    // Process ingredients when recipe changes
    useEffect(() => {
        if (recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0) {
            const tags = recipe.ingredients
                .slice(0, 2)
                .map(ing => typeof ing === 'string' ? ing.toLowerCase() : '')
                .filter(ing => ing && ing.length < 20);
            setIngredientTags(tags);
        } else {
            setIngredientTags([]);
        }
    }, [recipe.ingredients]);
        
    const [imageData, setImageData] = useState({
        imageUrl: '',
        smallImageUrl: '',
        photographer: '',
        photographerUrl: '',
        unsplashUrl: ''
    });
    
    // Load image from Unsplash when component mounts
    useEffect(() => {
        const loadRecipeImage = async () => {
            if (!recipe.name) {
                return;
            }
            
            setIsLoading(true);
            try {
                // First try with the specific recipe name for best matching
                const specificSearchTerm = recipe.name;
                
                // If it's a paneer dish or special cuisine, add more context
                const searchTerm = recipe.name.toLowerCase().includes('paneer') 
                    ? `${recipe.name} indian dish`  // Specific for paneer dishes
                    : specificSearchTerm;
                
                console.log(`Loading image for recipe: ${searchTerm}`);
                
                // Set a timeout to handle very slow responses
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Image fetch timeout')), 10000) // 10 second timeout
                );
                
                // Try to get the image with a timeout
                const result = await Promise.race([
                    fetchRecipeImage(searchTerm),
                    timeoutPromise
                ]);
                
                if (result && result.imageUrl) {
                    console.log(`Image fetched successfully for "${recipe.name}"`);
                    
                    setImageData(result);
                    setImageUrl(result.imageUrl);
                } else {
                    throw new Error('No image found');
                }
            } catch (error) {
                console.warn(`Error loading image for "${recipe.name}":`, error.message);
                
                if (imageRetries < 2) {
                    // Try a more generic search term on retry
                    try {
                        setImageRetries(prev => prev + 1);
                        
                        // Determine fallback search term
                        let retryTerm;
                        
                        if (imageRetries === 0) {
                            // First retry: try with recipe name + cuisine
                            retryTerm = `${recipe.name} ${recipe.cuisine || ''}`.trim();
                            console.log(`First retry with: "${retryTerm}"`);
                        } else {
                            // Second retry: use cuisine or main ingredient
                            retryTerm = recipe.cuisine || 
                                      (ingredientTags.length > 0 ? ingredientTags[0] : 'food');
                            console.log(`Second retry with: "${retryTerm}"`);
                        }
                        
                        const result = await fetchRecipeImage(retryTerm);
                        
                        if (result && result.imageUrl) {
                            console.log(`Retry successful for "${recipe.name}"`);
                            setImageData(result);
                            setImageUrl(result.imageUrl);
                        } else {
                            throw new Error('No image found in retry');
                        }
                    } catch (retryError) {
                        // Fall back to placeholder on retry failure
                        console.error(`Retry failed for "${recipe.name}":`, retryError.message);
                        useFallbackImage();
                    }
                } else {
                    // Set a fallback image after all retries fail
                    useFallbackImage();
                }
            } finally {
                setIsLoading(false);
            }
        };
        
        const useFallbackImage = () => {
            // Get cuisine-specific placeholder
            const placeholderUrl = getFoodPlaceholder(recipe.cuisine || recipe.name);
            
            console.log(`Using fallback image for "${recipe.name}"`);
                       
            setImageUrl(placeholderUrl);
            setImageData({
                imageUrl: placeholderUrl,
                smallImageUrl: placeholderUrl,
                photographer: 'Food Image',
                photographerUrl: '#',
                unsplashUrl: '#'
            });
        };
        
        loadRecipeImage();
    }, [recipe.name, recipe.cuisine, ingredientTags.join(','), imageRetries]);
    // Create recipe description - truncate if too long
    const displayDescription = recipe.description && recipe.description.length > 80
        ? recipe.description.substring(0, 80) + '...'
        : recipe.description;
        
    const handleRecipeClick = () => {
        // Check if this is an AI-generated recipe (doesn't have a real database ID)
        if (recipe.id && !recipe.id.toString().startsWith('temp-')) {
            // Real recipe from database
            navigate(`/recipe/${recipe.id}`);
        } else {
            // AI-generated recipe - pass the full recipe data in state including image info
            const enrichedRecipe = {
                ...recipe,
                imageUrl: imageUrl,
                imageData: imageData
            };
            const recipeId = recipe.id || recipe._id || 'temp-' + encodeURIComponent(recipe.name);
            navigate(`/ai-recipe/${recipeId}`, { 
                state: { recipe: enrichedRecipe }
            });
        }
    };
    
    return (
        <div 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={handleRecipeClick}
        >
            <div className="relative pb-3/4 h-48">
                {/* Loading state */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="animate-pulse flex space-x-2">
                            <div className="h-2 w-2 bg-orange-400 rounded-full"></div>
                            <div className="h-2 w-2 bg-orange-400 rounded-full"></div>
                            <div className="h-2 w-2 bg-orange-400 rounded-full"></div>
                        </div>
                    </div>
                )}
                
                {/* Unsplash image with error handling */}
                <img 
                    src={imageUrl || getFoodPlaceholder(recipe.cuisine || recipe.name)} 
                    alt={recipe.name || 'Food dish'} 
                    className="absolute h-full w-full object-cover transition-opacity duration-300"
                    onError={(e) => {
                        console.log("Image failed to load, using placeholder", e.target.src);
                        // Use a cuisine-specific placeholder
                        e.target.onerror = null; // Prevent infinite error loop
                        e.target.src = getFoodPlaceholder(recipe.cuisine || recipe.name);
                        
                        // Update image data
                        setImageData({
                            imageUrl: e.target.src,
                            smallImageUrl: e.target.src,
                            photographer: 'Food Image',
                            photographerUrl: '#',
                            unsplashUrl: '#'
                        });
                    }}
                    style={{ opacity: isLoading ? 0 : 1 }}
                    onLoad={() => setIsLoading(false)}
                />
                
                {/* Photo attribution overlay - required by Unsplash API Terms */}
                {!isLoading && imageData.photographer && imageData.photographer !== 'Food Image' && (
                    <a 
                        href={imageData.unsplashUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2 transition-opacity opacity-0 hover:opacity-100"
                    >
                        Photo by <span className="underline">{imageData.photographer}</span> on <span className="underline">Unsplash</span>
                    </a>
                )}
                
                {/* Cuisine tag */}
                <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 rounded-md bg-orange-100 text-orange-800 text-xs font-medium shadow-sm">
                        {recipe.cuisine || 'Recipe'}
                    </span>
                </div>
                
                {/* Star icon */}
                <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </div>
            </div>
            
            <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-1 hover:text-orange-600 line-clamp-2">
                    {recipe.name}
                </h3>
                
                {/* Only show description if available */}
                {displayDescription && (
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{displayDescription}</p>
                )}
                
                <p className="text-sm text-gray-500 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{prepTime} prep</span>
                    <span className="mx-2">•</span>
                    <span>{cookTime} cook</span>
                </p>
                
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-xs text-gray-500">by AI Chef</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        recipe.difficulty?.toLowerCase() === 'easy'
                            ? 'bg-green-100 text-green-800'
                            : recipe.difficulty?.toLowerCase() === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                    }`}>
                        {recipe.difficulty || 'Easy'}
                    </span>
                </div>
                
                {/* Show ingredient tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                    {ingredientTags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {tag}
                        </span>
                    ))}
                </div>
                
                {/* View recipe button */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRecipeClick();
                    }}
                    className="mt-4 w-full py-2 text-sm font-medium text-orange-600 border border-orange-300 rounded hover:bg-orange-50 transition-colors"
                >
                    View Recipe
                </button>
            </div>
        </div>
    );
};

const AIRecipeSuggest = () => {
    const [query, setQuery] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [dietaryPreferences, setDietaryPreferences] = useState('');
    const [suggestion, setSuggestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [parsedRecipes, setParsedRecipes] = useState([]);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleAISearch = async (e) => {
        e.preventDefault();
        
        // Don't proceed if query is empty
        if (!query.trim()) {
            setError("Please enter a search query");
            return;
        }
        
        setLoading(true);
        setError(null);
        setSuggestion(null);
        setParsedRecipes([]);
        
        const ingredientsArray = ingredients.split(',').filter(item => item.trim()).map(item => item.trim());
        const dietaryArray = dietaryPreferences.split(',').filter(item => item.trim()).map(item => item.trim());
        
        console.log('Sending AI request with:', { 
            query, 
            ingredients: ingredientsArray, 
            dietaryPreferences: dietaryArray 
        });
        
        // Function to create fallback recipes in case of API failure
        const createFallbackRecipes = () => {
            // Create 3 default recipes based on the query
            let cuisine = 'Mixed';
            
            // Detect cuisine from query
            if (query.toLowerCase().includes('italian')) cuisine = 'Italian';
            else if (query.toLowerCase().includes('indian')) cuisine = 'Indian';
            else if (query.toLowerCase().includes('paneer')) cuisine = 'Indian';
            else if (query.toLowerCase().includes('chinese')) cuisine = 'Chinese';
            else if (query.toLowerCase().includes('mexican')) cuisine = 'Mexican';
            else if (query.toLowerCase().includes('thai')) cuisine = 'Thai';
            else if (query.toLowerCase().includes('japanese')) cuisine = 'Japanese';
            
            const difficulty = query.toLowerCase().includes('easy') ? 'Easy' :
                             query.toLowerCase().includes('simple') ? 'Easy' :
                             query.toLowerCase().includes('hard') ? 'Hard' :
                             query.toLowerCase().includes('difficult') ? 'Hard' : 'Medium';
            
            // Use provided ingredients or create sensible defaults
            const baseIngredients = ingredientsArray.length > 0 ? 
                ingredientsArray : 
                query.toLowerCase().includes('pasta') ? ['pasta', 'tomatoes', 'garlic'] :
                query.toLowerCase().includes('curry') ? ['spices', 'onions', 'tomatoes'] :
                query.toLowerCase().includes('salad') ? ['lettuce', 'cucumber', 'olive oil'] :
                query.toLowerCase().includes('soup') ? ['vegetables', 'broth', 'herbs'] :
                ['vegetables', 'spices', 'oil'];
                
            // Create recipe name based on query and ingredients
            const baseQueryName = query.split(' ')
                .filter(word => !['recipe', 'dish', 'food', 'meal', 'dinner', 'lunch'].includes(word.toLowerCase()))
                .join(' ');
            
            const mainIngredient = ingredientsArray.length > 0 ? ingredientsArray[0] : '';
            
            return [
                {
                    name: `${cuisine} ${baseQueryName.charAt(0).toUpperCase() + baseQueryName.slice(1)}`,
                    description: `A delicious ${cuisine.toLowerCase()} style ${query.toLowerCase()} recipe.`,
                    ingredients: baseIngredients,
                    cookingTime: '30 mins',
                    cuisine,
                    difficulty
                },
                {
                    name: `Quick ${mainIngredient ? mainIngredient + " " : ""}${baseQueryName}`,
                    description: `A fast and simple ${query.toLowerCase()} recipe perfect for busy days.`,
                    ingredients: baseIngredients,
                    cookingTime: '15 mins',
                    cuisine,
                    difficulty: 'Easy'
                },
                {
                    name: `Gourmet ${baseQueryName}`,
                    description: `A sophisticated ${query.toLowerCase()} recipe for special occasions.`,
                    ingredients: baseIngredients,
                    cookingTime: '45 mins',
                    cuisine,
                    difficulty: 'Hard'
                }
            ];
        };
        
        try {
            // Try to get recipes from the API
            let res;
            try {
                console.log('Sending request to AI API...');
                const startTime = Date.now();
                
                res = await axios.post('http://localhost:5000/api/recipes/ai-suggest', { 
                    query, 
                    ingredients: ingredientsArray,
                    dietaryPreferences: dietaryArray
                }, { 
                    timeout: 15000 // 15 second timeout for better reliability
                });
                
                const elapsed = Date.now() - startTime;
                console.log(`AI API response received in ${elapsed}ms:`, res.data);
                setSuggestion(res.data);
            } catch (apiError) {
                console.error("API request failed, details:", apiError);
                
                // More detailed error message based on the error type
                let errorMessage = "AI suggestion unavailable. Showing default recipes instead.";
                
                if (apiError.code === 'ECONNREFUSED') {
                    errorMessage = "Cannot connect to the recipe AI service. Server may be offline.";
                } else if (apiError.code === 'ETIMEDOUT' || apiError.message.includes('timeout')) {
                    errorMessage = "AI service request timed out. Showing default recipes instead.";
                } else if (apiError.response) {
                    errorMessage = `Server error (${apiError.response.status}). Showing default recipes instead.`;
                }
                
                setError(errorMessage);
                console.log("Using fallback recipes due to API error");
                setParsedRecipes(createFallbackRecipes());
                setLoading(false);
                return;
            }
            
            // Try to extract recipes from AI response
            try {
                // Get the text response from Gemini
                const text = res.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                console.log('Raw AI response text (first 200 chars):', text.substring(0, 200) + '...');
                
                // Look for JSON in the text response - more robust pattern matching
                const jsonMatch = text.match(/\[\s*\{[\s\S]*?\}\s*\](?!\s*\])/);
                const jsonBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
                
                let extractedJson;
                
                // Try multiple ways to extract JSON
                if (jsonMatch) {
                    console.log('Found JSON array match');
                    try {
                        extractedJson = JSON.parse(jsonMatch[0]);
                    } catch (e) {
                        console.error('Error parsing JSON array match:', e);
                    }
                } else if (jsonBlockMatch) {
                    console.log('Found JSON code block match');
                    try {
                        extractedJson = JSON.parse(jsonBlockMatch[1]);
                    } catch (e) {
                        console.error('Error parsing JSON code block:', e);
                    }
                } else {
                    console.log('No JSON format found in standard patterns');
                }
                
                // If we found and parsed JSON successfully
                if (extractedJson) {
                    console.log('Successfully parsed JSON with', 
                               Array.isArray(extractedJson) ? extractedJson.length : 'unknown', 
                               'recipes');
                    
                    // Ensure we have an array of recipes
                    const recipes = Array.isArray(extractedJson) ? extractedJson : 
                                   (extractedJson.recipes && Array.isArray(extractedJson.recipes)) ? extractedJson.recipes : 
                                   [extractedJson]; // If it's a single recipe object
                    
                    // Validate each recipe has required fields and normalize data
                    const validRecipes = recipes
                        .filter(recipe => recipe && typeof recipe === 'object')
                        .map(recipe => ({
                            name: recipe.name || recipe.title || "Unnamed Recipe",
                            description: recipe.description || recipe.summary || "A delicious recipe suggestion.",
                            ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : 
                                       typeof recipe.ingredients === 'string' ? recipe.ingredients.split(',') :
                                       ["various ingredients"],
                            cookingTime: recipe.cookingTime || recipe.cookTime || recipe.time || "30 mins",
                            cuisine: recipe.cuisine || recipe.category || "Mixed",
                            difficulty: recipe.difficulty || recipe.skillLevel || "Medium"
                        }));
                    
                    if (validRecipes.length > 0) {
                        console.log(`Successfully created ${validRecipes.length} recipe cards`);
                        setParsedRecipes(validRecipes);
                    } else {
                        throw new Error("No valid recipes found in parsed data");
                    }
                } else {
                    // Try to extract recipe-like information from the text
                    console.log('Attempting to extract recipe information from text');
                    
                    // Check if we have ingredient lists with bullets or numbers
                    const hasIngredientsList = /ingredients:.*?[\n\r]+([-•*]|\d+\.)/i.test(text);
                    const hasCuisineMatch = text.match(/cuisine:\s*(\w+)/i);
                    const hasDifficultyMatch = text.match(/difficulty:\s*(\w+)/i);
                    
                    // Extract a title from the first line or use query
                    let recipeTitle = query.charAt(0).toUpperCase() + query.slice(1);
                    const firstLine = text.split('\n')[0];
                    if (firstLine && firstLine.length < 80 && !firstLine.includes(':')) {
                        recipeTitle = firstLine.trim();
                    }
                    
                    // Create a structured recipe from the text
                    console.log('Creating structured recipe from text');
                    
                    // Find potential ingredients in the text
                    let extractedIngredients = [];
                    const ingredientSection = text.match(/ingredients:[\s\S]*?(instructions|directions|method|steps)/i);
                    if (ingredientSection) {
                        const ingredientText = ingredientSection[0].replace(/ingredients:|\(instructions|directions|method|steps\)/ig, '');
                        extractedIngredients = ingredientText
                            .split(/\n/)
                            .filter(line => /^[-•*]|\d+\./.test(line.trim()))
                            .map(line => line.replace(/^[-•*]|\d+\./, '').trim());
                    }
                    
                    const defaultRecipe = {
                        name: recipeTitle,
                        description: text.substring(0, 150) + "...",
                        ingredients: extractedIngredients.length > 0 ? 
                            extractedIngredients : 
                            ingredients ? 
                                ingredients.split(',').filter(i => i.trim()).map(i => i.trim()) : 
                                ["various ingredients"],
                        cookingTime: text.match(/(\d+)\s*min/i) ? text.match(/(\d+)\s*min/i)[1] + " mins" : "30 mins",
                        cuisine: hasCuisineMatch ? hasCuisineMatch[1] : 
                                query.toLowerCase().includes('indian') ? "Indian" :
                                query.toLowerCase().includes('italian') ? "Italian" : 
                                query.toLowerCase().includes('mexican') ? "Mexican" : "Mixed",
                        difficulty: hasDifficultyMatch ? hasDifficultyMatch[1] : "Medium"
                    };
                    
                    // Create fallback recipes based on the query
                    const fallbackRecipes = createFallbackRecipes();
                    
                    // Add our extracted recipe to the beginning of the list
                    setParsedRecipes([defaultRecipe, ...fallbackRecipes.slice(0, 2)]);
                    console.log('Created recipe from text:', defaultRecipe.name);
                }
            } catch (parseError) {
                console.error('Failed to parse AI response:', parseError);
                console.log('Using fallback recipes due to parsing error');
                setParsedRecipes(createFallbackRecipes());
            }
        } catch (err) {
            console.error('AI API error:', err);
            
            // Handle different error cases with specific messages
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const statusCode = err.response.status;
                let errorMessage = `Server error (${statusCode})`;
                
                if (statusCode === 401 || statusCode === 403) {
                    errorMessage = 'Authentication error with AI service. Please check API keys.';
                } else if (statusCode === 429) {
                    errorMessage = 'Rate limit exceeded. Please try again later.';
                } else if (statusCode >= 500) {
                    errorMessage = 'AI service is currently unavailable. Showing default recipes instead.';
                }
                
                setError(errorMessage);
                console.error('Response data:', err.response.data);
                console.error('Response headers:', err.response.headers);
                
                // Provide fallback recipes
                setParsedRecipes(createFallbackRecipes());
            } else if (err.request) {
                // The request was made but no response was received
                setError('No response received from server. Please check if the backend is running.');
                console.error('Request details:', err.request);
                
                // Provide fallback recipes
                setParsedRecipes(createFallbackRecipes());
            } else {
                // Something happened in setting up the request that triggered an Error
                setError(`Error: ${err.message}`);
                
                // Provide fallback recipes
                setParsedRecipes(createFallbackRecipes());
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <span className="mr-2">🧠</span>
                AI Recipe Assistant
            </h2>
            <form onSubmit={handleAISearch} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="What would you like to cook today? (e.g., 'quick vegetarian dinner')"
                        className="border px-4 py-2 rounded w-full focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                    />
                    <button 
                        type="submit" 
                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded hover:from-orange-600 hover:to-orange-700 transition shadow-sm flex-shrink-0"
                    >
                        <span className="mr-1">✨</span> Ask AI
                    </button>
                </div>
                
                <div className="text-center">
                    <button 
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="text-sm text-gray-500 hover:text-orange-500 transition"
                    >
                        {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
                    </button>
                </div>
                
                {showAdvanced && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">Ingredients you have</label>
                            <input
                                type="text"
                                value={ingredients}
                                onChange={e => setIngredients(e.target.value)}
                                placeholder="tomatoes, pasta, basil (comma separated)"
                                className="border px-3 py-2 rounded w-full text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">Dietary preferences</label>
                            <input
                                type="text"
                                value={dietaryPreferences}
                                onChange={e => setDietaryPreferences(e.target.value)}
                                placeholder="vegetarian, gluten-free, low-carb"
                                className="border px-3 py-2 rounded w-full text-sm"
                            />
                        </div>
                    </div>
                )}
            </form>
            
            {loading && (
                <div className="mt-6 text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-orange-500 rounded-full border-t-transparent mx-auto"></div>
                    <p className="mt-2 text-orange-600">Cooking up suggestions...</p>
                </div>
            )}
            
            {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}
            
            {parsedRecipes.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">AI Suggested Recipes</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {parsedRecipes.map((recipe, index) => (
                            <RecipeSuggestionCard key={index} recipe={recipe} />
                        ))}
                    </div>
                </div>
            )}
            
            {suggestion && parsedRecipes.length === 0 && (
                <div className="mt-6 p-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">AI Response</h3>
                    <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded">{suggestion.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(suggestion, null, 2)}</pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIRecipeSuggest;
