import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://backend-project-7.onrender.com/api/v1',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // or wherever you store the token
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
