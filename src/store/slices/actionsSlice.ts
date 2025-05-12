import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as actionsApi from '../../api/actionsApi';

interface Action {
  id: string;
  title: string;
  category: string;
  points: number;
  icon: string;
  timestamp: string;
}

interface ActionsState {
  actions: Action[];
  availableActions: Action[];
  stats: any;
  loading: boolean;
  error: string | null;
}

const initialState: ActionsState = {
  actions: [],
  availableActions: [], // Will be fetched from backend or can be static if needed
  stats: null,
  loading: false,
  error: null,
};

export const fetchActions = createAsyncThunk('actions/fetchActions', async (_, { rejectWithValue }) => {
  try {
    return await actionsApi.fetchActions();
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch actions');
  }
});

export const logAction = createAsyncThunk('actions/logAction', async (action: Partial<Action>, { rejectWithValue }) => {
  try {
    return await actionsApi.logAction(action);
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to log action');
  }
});

export const deleteAction = createAsyncThunk('actions/deleteAction', async (id: string, { rejectWithValue }) => {
  try {
    await actionsApi.deleteAction(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete action');
  }
});

export const fetchActionStats = createAsyncThunk('actions/fetchActionStats', async (_, { rejectWithValue }) => {
  try {
    return await actionsApi.fetchActionStats();
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch action stats');
  }
});

const actionsSlice = createSlice({
  name: 'actions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActions.fulfilled, (state, action) => {
        state.loading = false;
        state.actions = action.payload;
      })
      .addCase(fetchActions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logAction.fulfilled, (state, action) => {
        state.loading = false;
        state.actions.unshift(action.payload);
      })
      .addCase(logAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAction.fulfilled, (state, action) => {
        state.loading = false;
        state.actions = state.actions.filter((a) => a.id !== action.payload);
      })
      .addCase(deleteAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchActionStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActionStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchActionStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default actionsSlice.reducer; 