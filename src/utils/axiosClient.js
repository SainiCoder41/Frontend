import axios from 'axios';
const axiosClient  = axios.create({
    baseURL:'https://backend-f.vercel.app',
    
    headers:{
        'Content-Type':'application/json'
    },
    withCredentials:true
});
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Or from Redux store
  console.log(token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosClient;
