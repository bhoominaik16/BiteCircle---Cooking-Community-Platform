import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Corrected import path for filterRecipes
import { getRecipes, filterRecipes } from '../features/recipes/recipesSlice';
import RecipeCard from '../Components/RecipeCard';
import RecipeCardSkeleton from '../Components/RecipeCardSkeleton';
import { Parallax } from 'react-scroll-parallax';
import AIRecipeSuggest from '../Components/AIRecipeSuggest';

const Home = () => {
    const dispatch = useDispatch();
    const { recipes, unfilteredRecipes, status, error } = useSelector(state => state.recipes);
    const { ingredients: userIngredients, dietary: dietaryPreferences } = useSelector(state => state.filters);
    const { suggestedRecipes, suggestStatus } = useSelector(state => state.recipes);

    // 1. Initial Data Fetch
    useEffect(() => {
        if (status === 'idle') {
            dispatch(getRecipes());
        }
    }, [status, dispatch]);
    
    // 2. Filter Application Effect
    useEffect(() => {
        if (status === 'succeeded' || status === 'idle') {
            dispatch(filterRecipes({ ingredients: userIngredients, dietaryPreferences: dietaryPreferences }));
        }
    }, [userIngredients, dietaryPreferences, dispatch, status]);

    if (status === 'loading') {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Parallax y={[-20, 20]} as="figure">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-700 mb-4">
                            Discover Amazing Recipes
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Find the perfect dish based on ingredients you have
                        </p>
                    </div>
                </Parallax>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[...Array(8)].map((_, i) => <RecipeCardSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    if (status === 'failed') {
        return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    }

    const isFilterActive = userIngredients.length > 0 || dietaryPreferences.length > 0;

    return (
        <div className="bg-gray-50">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <Parallax y={[-20, 20]} as="figure">
                    <div className="text-center mb-16 relative">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 relative">
                            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-600 to-red-700 animate-gradient">
                                Discover Amazing Recipes
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Find the perfect dish based on ingredients you have
                        </p>
                    </div>
                </Parallax>
                
                <AIRecipeSuggest />
                
                {suggestStatus === 'succeeded' && suggestedRecipes.length > 0 ? (
                    <div className="mt-16">
                        <h2 className="text-3xl font-bold text-gray-800 mb-8">AI Suggested Recipes</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                            {suggestedRecipes.map((recipe, index) => (
                                <RecipeCard 
                                    key={recipe._id || `ai-recipe-${index}`} 
                                    recipe={recipe} 
                                    isAI={true}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mt-16">
                        <h2 className="text-3xl font-bold text-gray-800 mb-8">
                           {isFilterActive ? `Filtered Recipes (${recipes.length})` : "Featured Recipes"}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                            {recipes.length > 0 ? (
                                recipes.map((recipe) => (
                                    <RecipeCard 
                                        key={recipe._id} 
                                        recipe={recipe} 
                                        isAI={false}
                                    />
                                ))
                            ) : (
                                <p className="text-center text-gray-500 col-span-full">
                                    No recipes found matching your filters. Try different ingredients or remove filters!
                                </p>
                            )}
                        </div>
                        {!isFilterActive && (
                            <div className="mt-16 text-center">
                                <button className="bg-gradient-to-r from-yellow-500 to-amber-700 hover:from-yellow-600 hover:to-amber-800 text-white font-bold py-3 px-8 rounded-full shadow-xl transform hover:scale-110 transition-all duration-300 ease-in-out">
                                    Load More Recipes
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;