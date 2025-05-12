import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const register = async (name: string, email: string, password: string) => {
  const res = await axios.post(`${API_URL}/register`, { name, email, password });
  return res.data;
};

export const login = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
};

export const getProfile = async () => {
  const res = await axios.get(`${API_URL}/profile`, { headers: getAuthHeader() });
  return res.data;
};

export const updateProfile = async (updates: Partial<{ name: string; email: string; password: string }>) => {
  const res = await axios.patch(`${API_URL}/profile`, updates, { headers: getAuthHeader() });
  return res.data;
}; 