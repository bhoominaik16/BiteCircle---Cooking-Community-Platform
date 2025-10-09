
// Front-end/src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import recipesReducer from '../features/recipes/recipesSlice';
import collectionsReducer from '../features/collections/collectionsSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import filtersReducer from '../features/filters/filtersSlice'; // NEW: Import the new reducer

export const store = configureStore({
    reducer: {
        auth: authReducer,
        recipes: recipesReducer,
        collections: collectionsReducer,
        dashboard: dashboardReducer,
        filters: filtersReducer, // NEW: Add the filters reducer
    },
});