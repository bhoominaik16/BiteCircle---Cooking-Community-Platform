import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../utils/config';
import axios from 'axios';

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
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue, getState }) => {
    try {
      const user = getState().auth.user;
      if (!user || !user.token) {
        return rejectWithValue('User not authenticated');
      }
      const token = user.token;
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
  }
);
const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        // Corrected Reducer: This will be called from App.jsx to update activity in real-time
        addRecentActivity: (state, action) => {
            state.recentActivities.unshift(action.payload);
            // Optional: Limit the number of recent activities to prevent the list from growing too large
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
            });
    },
});

export const { addRecentActivity } = dashboardSlice.actions;

export default dashboardSlice.reducer;