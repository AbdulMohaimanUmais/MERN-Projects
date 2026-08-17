import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

API.interceptors.request.use((req) => {
  const user = localStorage.getItem('chatUser');
  if (user) {
    const token = JSON.parse(user).token;
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;