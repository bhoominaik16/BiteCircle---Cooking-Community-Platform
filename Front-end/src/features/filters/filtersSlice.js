import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    ingredients: [],
    dietary: [],
};

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        addIngredient: (state, action) => {
            if (!state.ingredients.includes(action.payload)) {
                state.ingredients.push(action.payload);
            }
        },
        removeIngredient: (state, action) => {
            state.ingredients = state.ingredients.filter(
                (ingredient) => ingredient !== action.payload
            );
        },
        toggleDietary: (state, action) => {
            const preference = action.payload;
            if (state.dietary.includes(preference)) {
                state.dietary = state.dietary.filter((p) => p !== preference);
            } else {
                state.dietary.push(preference);
            }
        },
        clearFilters: (state) => {
            state.ingredients = [];
            state.dietary = [];
        },
    },
});

export const { addIngredient, removeIngredient, toggleDietary, clearFilters } = filtersSlice.actions;
export default filtersSlice.reducer;