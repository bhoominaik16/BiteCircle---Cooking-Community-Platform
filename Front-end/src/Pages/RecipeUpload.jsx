import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveRecipe } from '../features/recipes/recipesSlice';
import { useNavigate } from 'react-router-dom';

const RecipeUpload = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error } = useSelector(state => state.recipes);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        prepTime: '',
        cookTime: '',
        servings: '',
        difficulty: 'Easy',
        category: '',
        ingredients: [''],
        steps: [''],
        tags: [],
        dietary: [],
        videoFile: null, // Change to store the file object
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            videoFile: e.target.files[0],
        });
    };

    const handleArrayChange = (index, field, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({
            ...formData,
            [field]: newArray
        });
    };

    const addArrayField = (field) => {
        setFormData({
            ...formData,
            [field]: [...formData[field], '']
        });
    };

    const removeArrayField = (field, index) => {
        const newArray = [...formData[field]];
        newArray.splice(index, 1);
        setFormData({
            ...formData,
            [field]: newArray
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a FormData object for file upload
        const formPayload = new FormData();
        formPayload.append('title', formData.title);
        formPayload.append('description', formData.description);
        formPayload.append('prepTime', formData.prepTime);
        formPayload.append('cookTime', formData.cookTime);
        formPayload.append('servings', formData.servings);
        formPayload.append('difficulty', formData.difficulty);
        formPayload.append('category', formData.category);
        formPayload.append('ingredients', JSON.stringify(formData.ingredients));
        formPayload.append('steps', JSON.stringify(formData.steps));
        formPayload.append('tags', JSON.stringify(formData.tags));
        formPayload.append('dietary', JSON.stringify(formData.dietary));
        if (formData.videoFile) {
            formPayload.append('video', formData.videoFile);
        }

        // NOTE: Changed createRecipe to saveRecipe here
        const resultAction = await dispatch(saveRecipe(formPayload));
        
        if (saveRecipe.fulfilled.match(resultAction)) {
            alert('Recipe uploaded successfully!');
            navigate('/');
        } else {
            alert(`Failed to upload recipe: ${error || 'Unknown error'}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Upload a Recipe</h1>
                <p className="text-gray-600">Share your culinary creation with the community</p>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow overflow-hidden p-6">
                <div className="mb-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Recipe Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                    />
                </div>
                
                <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Describe your recipe..."
                        required
                    ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-1">
                            Prep Time (minutes)
                        </label>
                        <input
                            type="number"
                            id="prepTime"
                            name="prepTime"
                            value={formData.prepTime}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700 mb-1">
                            Cook Time (minutes)
                        </label>
                        <input
                            type="number"
                            id="cookTime"
                            name="cookTime"
                            value={formData.cookTime}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-1">
                            Servings
                        </label>
                        <input
                            type="number"
                            id="servings"
                            name="servings"
                            value={formData.servings}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                            Difficulty
                        </label>
                        <select
                            id="difficulty"
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                    
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        >
                            <option value="">Select category</option>
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="appetizer">Appetizer</option>
                            <option value="dessert">Dessert</option>
                            <option value="snack">Snack</option>
                            <option value="beverage">Beverage</option>
                        </select>
                    </div>
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ingredients
                    </label>
                    {formData.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex mb-2">
                            <input
                                type="text"
                                value={ingredient}
                                onChange={(e) => handleArrayChange(index, 'ingredients', e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Ingredient and quantity"
                            />
                            {formData.ingredients.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeArrayField('ingredients', index)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayField('ingredients')}
                        className="mt-2 text-orange-600 hover:text-orange-800 text-sm font-medium"
                    >
                        + Add Another Ingredient
                    </button>
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Steps
                    </label>
                    {formData.steps.map((step, index) => (
                        <div key={index} className="flex mb-4">
                            <span className="bg-orange-100 text-orange-800 rounded-full h-8 w-8 flex items-center justify-center mt-2 mr-3 flex-shrink-0">
                                {index + 1}
                            </span>
                            <textarea
                                value={step}
                                onChange={(e) => handleArrayChange(index, 'steps', e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                rows={2}
                                placeholder="Describe this step..."
                            />
                            {formData.steps.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeArrayField('steps', index)}
                                    className="ml-2 text-red-500 hover:text-red-700 self-start mt-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayField('steps')}
                        className="mt-2 text-orange-600 hover:text-orange-800 text-sm font-medium"
                    >
                        + Add Another Step
                    </button>
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dietary Information
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo'].map((diet) => (
                            <label key={diet} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.dietary.includes(diet)}
                                    onChange={(e) => {
                                        const newDietary = e.target.checked
                                            ? [...formData.dietary, diet]
                                            : formData.dietary.filter(d => d !== diet);
                                        setFormData({ ...formData, dietary: newDietary });
                                    }}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">{diet}</span>
                            </label>
                        ))}
                    </div>
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags (comma separated)
                    </label>
                    <input
                        type="text"
                        value={formData.tags.join(', ')}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g. quick, healthy, summer"
                    />
                </div>
                
                {/* File input for video upload */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Recipe Video
                    </label>
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm text-gray-500">Click to upload a video</p>
                            </div>
                            <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
                        </label>
                    </div>
                    {formData.videoFile && (
                        <p className="mt-2 text-sm text-gray-600">Selected file: {formData.videoFile.name}</p>
                    )}
                </div>
                
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Uploading...' : 'Upload Recipe'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RecipeUpload;
