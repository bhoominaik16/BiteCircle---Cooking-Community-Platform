// Front-end/src/features/mealPlanner/mealPlannerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    weeklyPlan: {},
    shoppingList: [],
};

const mealPlannerSlice = createSlice({
    name: 'mealPlanner',
    initialState,
    reducers: {
        // Add reducers for meal planning actions here
    },
});

// Remove the empty destructuring export
// export const { } = mealPlannerSlice.actions;

export default mealPlannerSlice.reducer;