import axios from 'axios';
import authService from './authService';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://13.61.143.142/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use(
  config => {
    const token = authService.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

export default api;