import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/recipes';
const COMMENT_URL = 'http://localhost:5000/api/comments';

export const getRecipes = createAsyncThunk('recipes/getRecipes', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data.message || err.message);
    }
});

export const getRecipeById = createAsyncThunk('recipes/getRecipeById', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data.message || err.message);
    }
});

export const postComment = createAsyncThunk('recipes/postComment', async (commentData, { rejectWithValue, getState }) => {
    try {
        const { auth: { user } } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };
        const response = await axios.post(COMMENT_URL, commentData, config);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data.message || err.message);
    }
});

export const saveRecipe = createAsyncThunk(
    'recipes/saveRecipe',
    async (recipeData, { rejectWithValue, getState }) => {
        try {
            const { auth: { user } } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const response = await axios.post(API_URL, recipeData, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || error.message);
        }
    }
);

export const getAISuggestions = createAsyncThunk(
    'recipes/getAISuggestions',
    async (queryData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/ai-suggest`, queryData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data.message || err.message);
        }
    }
);

// FIX: This thunk now returns the full recipe object, not just the likes count
export const likeRecipe = createAsyncThunk(
    'recipes/likeRecipe',
    async (recipeId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.user.token;
            
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.put(`${API_URL}/${recipeId}/like`, {}, config); 
            return response.data; // This is the full recipe object from the backend
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// FIX: This thunk now returns the full recipe object, not just the likes count
export const unlikeRecipe = createAsyncThunk(
    'recipes/unlikeRecipe',
    async (recipeId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.user.token;
            
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.put(`${API_URL}/${recipeId}/unlike`, {}, config); 
            return response.data; // This is the full recipe object from the backend
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const initialState = { 
    recipes: [], 
    status: 'idle', 
    error: null, 
    selectedRecipe: null,
    suggestedRecipes: [],
    suggestStatus: 'idle',
    unfilteredRecipes: [],
};

const recipesSlice = createSlice({
    name: 'recipes',
    initialState,
    reducers: {
        clearSelectedRecipe: (state) => {
            state.selectedRecipe = null;
        },
        addCommentToSelectedRecipe: (state, action) => {
            if (state.selectedRecipe) {
                state.selectedRecipe.comments.push(action.payload.comment);
            }
        },
        filterRecipes: (state, action) => {
            const { ingredients, dietaryPreferences } = action.payload;
            let filtered = [...state.unfilteredRecipes];

            if (ingredients && ingredients.length > 0) {
                const ingredientTerms = ingredients.map(i => i.toLowerCase());
                filtered = filtered.filter(recipe => 
                    recipe.ingredients && recipe.ingredients.some(ing => 
                        ingredientTerms.some(term => ing.toLowerCase().includes(term))
                    )
                );
            }

            if (dietaryPreferences && dietaryPreferences.length > 0) {
                const dietTerms = dietaryPreferences.map(d => d.toLowerCase().replace('-', ''));
                filtered = filtered.filter(recipe => 
                    recipe.dietary && dietTerms.every(term => 
                        recipe.dietary.map(d => d.toLowerCase().replace('-', '')).includes(term)
                    )
                );
            }

            state.recipes = filtered;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRecipes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getRecipes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.unfilteredRecipes = action.payload;
                state.recipes = action.payload;
            })
            .addCase(getRecipes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            
            .addCase(getRecipeById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getRecipeById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedRecipe = action.payload;
            })
            .addCase(getRecipeById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            
            .addCase(postComment.pending, (state) => {
            })
            .addCase(postComment.fulfilled, (state, action) => {
                if (state.selectedRecipe) {
                    state.selectedRecipe.comments.push(action.payload);
                }
            })
            .addCase(postComment.rejected, (state, action) => {
            });

        builder
            .addCase(saveRecipe.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(saveRecipe.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.unfilteredRecipes.push(action.payload);
                state.recipes.push(action.payload);
            })
            .addCase(saveRecipe.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });

        // FIX: The reducers now handle the full recipe object from the backend
        builder
            .addCase(likeRecipe.fulfilled, (state, action) => {
                if (state.selectedRecipe) {
                    state.selectedRecipe.likes = action.payload.likes; // Action payload is the full recipe
                }
            })
            .addCase(unlikeRecipe.fulfilled, (state, action) => {
                if (state.selectedRecipe) {
                    state.selectedRecipe.likes = action.payload.likes; // Action payload is the full recipe
                }
            });

        builder
            .addCase(getAISuggestions.pending, (state) => {
                state.suggestStatus = 'loading';
            })
            .addCase(getAISuggestions.fulfilled, (state, action) => {
                state.suggestStatus = 'succeeded';
                state.suggestedRecipes = action.payload.recipes;
            })
            .addCase(getAISuggestions.rejected, (state, action) => {
                state.suggestStatus = 'failed';
                state.error = action.payload;
            });
    },
});

export const { clearSelectedRecipe, addCommentToSelectedRecipe, filterRecipes } = recipesSlice.actions;

export default recipesSlice.reducer;