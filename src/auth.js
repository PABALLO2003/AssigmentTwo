import axios from 'axios';

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Login failed' };
  }
};
export const getToken = () => {
  return localStorage.getItem('token');
};