import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(config => {
  console.log('Отправка запроса на:', config.baseURL + config.url);
  return config;
});

export default api;