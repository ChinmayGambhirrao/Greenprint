import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './store/slices/userSlice';
import type { AppDispatch, RootState } from './store';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Actions from './pages/Actions';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Route Component
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.user);

  // Show loading state or similar while checking auth
  if (loading) {
     // You might want a more sophisticated loading spinner here
     return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  const dispatch = useDispatch<AppDispatch>();

  // Check authentication status on initial load
  useEffect(() => {
    dispatch(checkAuth()); 
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes wrapped in Layout */}
        <Route element={<Layout><ProtectedRoute /></Layout>}> 
          <Route path="/" element={<Dashboard />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        
        {/* Optional: Add a 404 Not Found route */}
        {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
