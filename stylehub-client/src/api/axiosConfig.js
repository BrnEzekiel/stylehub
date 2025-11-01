import axios from 'axios';

// 1. Define the base URL of your API
const API_BASE_URL = 'http://localhost:3001/api';

// 2. Create the Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// 3. (Optional but recommended) Add an interceptor to attach the auth token
// This will automatically add the 'Authorization' header to every request
// if a token is found in localStorage.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;