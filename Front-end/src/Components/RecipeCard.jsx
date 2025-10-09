import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getFoodPlaceholder } from '../utils/placeholderImages';
import { useSelector } from 'react-redux';

const RecipeCard = ({ recipe }) => {
    const { user } = useSelector(state => state.auth); 
    
    const [imageUrl, setImageUrl] = useState(null);
    const [imageError, setImageError] = useState(false);

    const fetchRecipeImage = async (title) => {
        try {
            const response = await axios.get(`https://api.unsplash.com/search/photos`, {
                params: {
                    query: `${title} food`,
                    per_page: 1
                },
                headers: {
                    Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`
                }
            });

            if (response.data.results.length > 0) {
                setImageUrl(response.data.results[0].urls.regular);
            }
        } catch (error) {
            console.error('Error fetching image:', error);
            setImageError(true);
        }
    };

    useEffect(() => {
        if (recipe.title && !recipe.imageUrl && !imageError) {
            fetchRecipeImage(recipe.title);
        }
    }, [recipe.title, recipe.imageUrl, imageError]);
    
    const isDatasetRecipe = !recipe._id;
    const recipeId = isDatasetRecipe ? `dataset-${encodeURIComponent(recipe.title)}` : recipe._id;

    const displayImageUrl = imageUrl || recipe.imageUrl || getFoodPlaceholder(recipe.title);

    // CLEANED UP LOGIC: Now that the backend provides populated user data
    let creatorName = 'Community Creator';
    if (recipe.isAI) {
        creatorName = 'AI Assistant';
    } else if (recipe.user?.name) { 
        creatorName = recipe.user.name;
    }


    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 ease-in-out">
            <Link to={`/recipe/${recipeId}`} state={{ recipe: { ...recipe, imageUrl: displayImageUrl } }}>
                <div className="relative pb-3/4 h-48">
                    <img
                        src={displayImageUrl}
                        alt={recipe.title}
                        className="absolute h-full w-full object-cover"
                        onError={() => {
                            setImageUrl(getFoodPlaceholder(recipe.title));
                        }}
                    />
                </div>
            </Link>
            
            <div className="p-5">
                <Link to={`/recipe/${recipeId}`} state={{ recipe: { ...recipe, imageUrl: displayImageUrl } }}>
                    <h3 className="font-bold text-xl text-gray-900 mb-2 hover:text-indigo-600 transition-colors duration-300">{recipe.title}</h3>
                </Link>
                <p className="text-sm text-gray-500 mb-3">by <span className="font-medium text-gray-700">{creatorName}</span></p>
                
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <span>{recipe.prepTime} mins prep</span>
                        <span className="mx-2">•</span>
                        <span>{recipe.cookTime} mins cook</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        recipe.difficulty === 'Easy'
                            ? 'bg-green-100 text-green-800'
                            : recipe.difficulty === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                    }`}>
                        {recipe.difficulty}
                    </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-5">
                    {recipe.tags?.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="text-base font-bold text-gray-800">{recipe.rating}</span>
                    </div>
                    <button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
                        Save Recipe
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;