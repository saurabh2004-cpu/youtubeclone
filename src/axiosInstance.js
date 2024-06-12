import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'https://backend-project-7.onrender.com/api/v1';

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

export default axiosInstance;
