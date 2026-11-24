import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchStudyPlan = createAsyncThunk(
  'planner/fetchStudyPlan',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/planner');
      return response.data.plan;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch study plan');
    }
  }
);

export const updatePlanSettings = createAsyncThunk(
  'planner/updatePlanSettings',
  async (planData, { rejectWithValue }) => {
    try {
      const response = await api.put('/planner', planData);
      return response.data.plan;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update plan');
    }
  }
);

export const generateSchedule = createAsyncThunk(
  'planner/generateSchedule',
  async (daysCount, { rejectWithValue }) => {
    try {
      const response = await api.post('/planner/generate-schedule', { daysCount });
      return response.data.plan;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to generate schedule');
    }
  }
);

export const addDailyGoal = createAsyncThunk(
  'planner/addDailyGoal',
  async (goalData, { rejectWithValue }) => {
    try {
      const response = await api.post('/planner/goals', goalData);
      return response.data.plan;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add daily goal');
    }
  }
);

export const toggleDailyGoal = createAsyncThunk(
  'planner/toggleDailyGoal',
  async (goalId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/planner/goals/${goalId}/toggle`);
      return response.data.plan;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to toggle goal');
    }
  }
);

export const deleteDailyGoal = createAsyncThunk(
  'planner/deleteDailyGoal',
  async (goalId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/planner/goals/${goalId}`);
      return response.data.plan;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete goal');
    }
  }
);

const plannerSlice = createSlice({
  name: 'planner',
  initialState: {
    plan: null,
    loading: false,
    generating: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudyPlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudyPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plan = action.payload;
      })
      .addCase(fetchStudyPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePlanSettings.fulfilled, (state, action) => {
        state.plan = action.payload;
      })
      .addCase(generateSchedule.pending, (state) => {
        state.generating = true;
      })
      .addCase(generateSchedule.fulfilled, (state, action) => {
        state.generating = false;
        state.plan = action.payload;
      })
      .addCase(generateSchedule.rejected, (state, action) => {
        state.generating = false;
        state.error = action.payload;
      })
      .addCase(addDailyGoal.fulfilled, (state, action) => {
        state.plan = action.payload;
      })
      .addCase(toggleDailyGoal.fulfilled, (state, action) => {
        state.plan = action.payload;
      })
      .addCase(deleteDailyGoal.fulfilled, (state, action) => {
        state.plan = action.payload;
      });
  },
});

export default plannerSlice.reducer;
