import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import goalsReducer from './slices/goalsSlice';
import actionsReducer from './slices/actionsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    goals: goalsReducer,
    actions: actionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 