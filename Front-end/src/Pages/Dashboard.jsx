import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// Import the thunks from your recipesSlice.js
import { likeRecipe, unlikeRecipe, saveRecipe } from '../features/recipes/recipesSlice';
import { API_BASE_URL } from '../utils/config';

const API_URL = `${API_BASE_URL}/api/users`;
const ACTIVITY_URL = `${API_BASE_URL}/api/activity`;

const initialState = {
    stats: {},
    recentActivities: [],
    myCookbook: [],
    likedRecipes: [],
    collections: [],
    status: 'idle',
    error: null,
};

// Async Thunk to fetch all dashboard data
export const fetchDashboardData = createAsyncThunk('dashboard/fetchData', async (_, { rejectWithValue, getState }) => {
    try {
        const token = getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        
        const dashboardResponse = await axios.get(`${API_URL}/dashboard`, config);
        const activityResponse = await axios.get(ACTIVITY_URL, config);
        
        return {
            ...dashboardResponse.data,
            recentActivities: activityResponse.data,
        };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        addRecentActivity: (state, action) => {
            state.recentActivities.unshift(action.payload);
            if (state.recentActivities.length > 10) {
                state.recentActivities.pop();
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.stats = action.payload.stats;
                state.recentActivities = action.payload.recentActivities;
                state.myCookbook = action.payload.myCookbook;
                state.likedRecipes = action.payload.likedRecipes;
                state.collections = action.payload.collections;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // FIX: Add case for when a recipe is liked
            .addCase(likeRecipe.fulfilled, (state, action) => {
                const likedRecipe = action.payload;
                // Add the recipe to the likedRecipes array if it's not already there
                if (!state.likedRecipes.some(recipe => recipe._id === likedRecipe._id)) {
                    state.likedRecipes.push(likedRecipe);
                }
            })
            // FIX: Add case for when a recipe is unliked
            .addCase(unlikeRecipe.fulfilled, (state, action) => {
                const unlikedRecipe = action.payload;
                // Remove the recipe from the likedRecipes array
                state.likedRecipes = state.likedRecipes.filter(
                    (recipe) => recipe._id !== unlikedRecipe._id
                );
            })
            // FIX: Add case for when a recipe is saved (for AI/Dataset)
            .addCase(saveRecipe.fulfilled, (state, action) => {
                const savedRecipe = action.payload;
                // If the user likes a saved AI/Dataset recipe, it will now have an _id
                // We should make sure it is added to the cookbook and liked recipes
                if (savedRecipe.isAIGenerated || savedRecipe.isDataset) {
                    const existingRecipeIndex = state.myCookbook.findIndex(recipe => recipe._id === savedRecipe._id);
                    if (existingRecipeIndex === -1) {
                         state.myCookbook.push(savedRecipe);
                    }
                }
            });
    },
});

export const { addRecentActivity } = dashboardSlice.actions;

export default dashboardSlice.reducer;