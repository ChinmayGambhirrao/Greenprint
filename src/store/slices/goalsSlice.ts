import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as goalsApi from '../../api/goalsApi';

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  unit: string;
  completed: boolean;
  category: string;
}

interface GoalsState {
  goals: Goal[];
  loading: boolean;
  error: string | null;
}

const initialState: GoalsState = {
  goals: [],
  loading: false,
  error: null,
};

export const fetchGoals = createAsyncThunk('goals/fetchGoals', async (_, { rejectWithValue }) => {
  try {
    return await goalsApi.fetchGoals();
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch goals');
  }
});

export const createGoal = createAsyncThunk('goals/createGoal', async (goal: Partial<Goal>, { rejectWithValue }) => {
  try {
    return await goalsApi.createGoal(goal);
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create goal');
  }
});

export const updateGoal = createAsyncThunk('goals/updateGoal', async ({ id, updates }: { id: string; updates: Partial<Goal> }, { rejectWithValue }) => {
  try {
    return await goalsApi.updateGoal(id, updates);
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update goal');
  }
});

export const deleteGoal = createAsyncThunk('goals/deleteGoal', async (id: string, { rejectWithValue }) => {
  try {
    await goalsApi.deleteGoal(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete goal');
  }
});

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.goals.push(action.payload);
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.goals.findIndex((g) => g.id === action.payload.id);
        if (idx !== -1) state.goals[idx] = action.payload;
      })
      .addCase(updateGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = state.goals.filter((g) => g.id !== action.payload);
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default goalsSlice.reducer; 