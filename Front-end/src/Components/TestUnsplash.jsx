// Front-end/src/Components/TestUnsplash.jsx
import React, { useState, useEffect } from 'react';
import { fetchRecipeImage } from '../utils/unsplashService';

/**
 * A test component to show how the enhanced Unsplash image matching works
 * with different types of recipes
 */
const TestUnsplash = () => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState('');
  
  // List of recipes to test with
  const testRecipes = [
    'Butter Chicken',
    'Palak Paneer',
    'Kadai Paneer',
    'Shahi Paneer',
    'Pasta Carbonara',
    'Thai Green Curry',
    'Vegetable Biryani'
  ];
  
  // Run a test for a specific recipe
  const testRecipeImage = async (recipe) => {
    try {
      setIsLoading(true);
      const result = await fetchRecipeImage(recipe);
      
      return {
        recipe,
        success: !!result.imageUrl,
        imageUrl: result.imageUrl,
        photographer: result.photographer,
        error: null
      };
    } catch (error) {
      return {
        recipe,
        success: false,
        imageUrl: null,
        error: error.message
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Test all recipes
  const runAllTests = async () => {
    setIsLoading(true);
    const results = await Promise.all(
      testRecipes.map(recipe => testRecipeImage(recipe))
    );
    setTestResults(results);
    setIsLoading(false);
  };
  
  // Test a custom recipe name
  const testCustomRecipe = async (e) => {
    e.preventDefault();
    if (!customQuery) return;
    
    setIsLoading(true);
    const result = await testRecipeImage(customQuery);
    setTestResults([result, ...testResults]);
    setIsLoading(false);
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Unsplash Recipe Image Test</h2>
      
      {/* Custom query form */}
      <form onSubmit={testCustomRecipe} className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={customQuery}
            onChange={e => setCustomQuery(e.target.value)}
            placeholder="Enter recipe name to test"
            className="border px-4 py-2 rounded flex-1"
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading || !customQuery}
          >
            Test Recipe
          </button>
        </div>
      </form>
      
      {/* Test all button */}
      <div className="mb-6">
        <button 
          onClick={runAllTests} 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Testing...' : 'Test All Recipes'}
        </button>
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}
      
      {/* Test results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testResults.map((result, index) => (
          <div key={index} className={`border rounded-lg overflow-hidden ${result.success ? 'border-green-200' : 'border-red-200'}`}>
            <div className="p-4 bg-gray-50">
              <h3 className="font-semibold text-lg">{result.recipe}</h3>
              <p className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                {result.success ? 'Success' : 'Failed'}
              </p>
            </div>
            
            {result.success && (
              <div className="relative h-48">
                <img 
                  src={result.imageUrl} 
                  alt={result.recipe}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2">
                  Photo by {result.photographer}
                </div>
              </div>
            )}
            
            {!result.success && (
              <div className="p-4 bg-red-50 text-red-800 text-sm">
                {result.error}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {testResults.length === 0 && !isLoading && (
        <p className="text-center text-gray-500 my-10">No tests run yet</p>
      )}
    </div>
  );
};

export default TestUnsplash;