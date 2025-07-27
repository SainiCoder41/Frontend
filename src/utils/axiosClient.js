import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://backend-f.vercel.app',
   withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  // Important: enables sending cookies
});

export default axiosClient;
