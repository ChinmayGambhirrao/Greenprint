import axios from 'axios';

const API_URL = 'http://localhost:5000/api/actions';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchActions = async () => {
  const res = await axios.get(API_URL, { headers: getAuthHeader() });
  return res.data;
};

export const logAction = async (action: any) => {
  const res = await axios.post(API_URL, action, { headers: getAuthHeader() });
  return res.data;
};

export const deleteAction = async (id: string) => {
  const res = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
  return res.data;
};

export const fetchActionStats = async () => {
  const res = await axios.get(`${API_URL}/stats`, { headers: getAuthHeader() });
  return res.data;
}; 