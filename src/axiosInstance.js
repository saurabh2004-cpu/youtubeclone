import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'https://backend-project-7.onrender.com/api/v1',
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true, // To send cookies with requests
});

axiosInstance.interceptors.request.use(
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

export default axiosInstance;
