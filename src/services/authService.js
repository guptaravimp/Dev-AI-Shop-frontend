import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

// Create axios instance with default config
const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication service functions
export const authService = {
  // Register new user
  signup: async (userData) => {
    try {
      const response = await authAPI.post('/signup', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'buyer'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await authAPI.post('/login', {
        email: credentials.email,
        password: credentials.password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Logout user
  logout: async (email) => {
    try {
      const response = await authAPI.post('/logout', {
        email: email
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Logout failed' };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Get token from localStorage
  getToken: () => {
    try {
      const token = localStorage.getItem('token');
      return token ? JSON.parse(token) : null;
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  },

  // Clear authentication data
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authService; 