import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userApi from '../../api/userApi';

interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  level: number;
  points: number;
  achievements: string[];
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  level: 1,
  points: 0,
  achievements: [],
  isAuthenticated: false,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await userApi.register(data.name, data.email, data.password);
      localStorage.setItem('token', res.token);
      return { ...res.user, token: res.token };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await userApi.login(data.email, data.password);
      localStorage.setItem('token', res.token);
      return { ...res.user, token: res.token };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await userApi.getProfile();
      return res.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Fetch profile failed');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (updates: Partial<{ name: string; email: string; password: string }>, { rejectWithValue }) => {
    try {
      const res = await userApi.updateProfile(updates);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Update profile failed');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }
      const res = await userApi.getProfile();
      return res.user;
    } catch (err: any) {
      localStorage.removeItem('token');
      return rejectWithValue(err.response?.data?.message || 'Authentication failed');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      return { ...initialState, token: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.id = action.payload.id;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.level = action.payload.level;
        state.points = action.payload.points;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.id = action.payload.id;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.level = action.payload.level;
        state.points = action.payload.points;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.id = action.payload.id;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.level = action.payload.level;
        state.points = action.payload.points;
        state.achievements = action.payload.achievements || [];
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.name = action.payload.name;
        state.email = action.payload.email;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.id = action.payload.id;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.level = action.payload.level;
        state.points = action.payload.points;
        state.achievements = action.payload.achievements || [];
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer; 