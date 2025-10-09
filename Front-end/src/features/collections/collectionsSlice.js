import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    collections: [],
    status: 'idle',
    error: null,
};

// Async Thunk to create a new collection
export const createCollection = createAsyncThunk('collections/createCollection', async (name, { rejectWithValue, getState }) => {
    try {
        const token = getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post('http://localhost:5000/api/users/collection', { name }, config);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

// Async Thunk to add a recipe to an existing collection
export const addRecipeToCollection = createAsyncThunk(
    'collections/addRecipeToCollection', 
    async ({ collectionId, recipeId }, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.put(`http://localhost:5000/api/users/collection/${collectionId}`, { recipeId }, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || error.message);
        }
    }
);

const collectionsSlice = createSlice({
    name: 'collections',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createCollection.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createCollection.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.collections.push(action.payload);
            })
            .addCase(createCollection.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(addRecipeToCollection.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addRecipeToCollection.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // The backend should return the updated collection
                const updatedCollection = action.payload;
                const index = state.collections.findIndex(col => col._id === updatedCollection._id);
                if (index !== -1) {
                    state.collections[index] = updatedCollection;
                }
            })
            .addCase(addRecipeToCollection.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default collectionsSlice.reducer;