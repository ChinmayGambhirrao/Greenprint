import axios from 'axios';

const API_URL = 'http://localhost:5000/api/goals';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchGoals = async () => {
  const res = await axios.get(API_URL, { headers: getAuthHeader() });
  return res.data;
};

export const createGoal = async (goal: any) => {
  const res = await axios.post(API_URL, goal, { headers: getAuthHeader() });
  return res.data;
};

export const updateGoal = async (id: string, updates: any) => {
  const res = await axios.patch(`${API_URL}/${id}`, updates, { headers: getAuthHeader() });
  return res.data;
};

export const deleteGoal = async (id: string) => {
  const res = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
  return res.data;
}; 