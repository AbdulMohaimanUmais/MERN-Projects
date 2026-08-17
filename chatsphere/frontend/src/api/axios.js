import axios from 'axios';

const API = axios.create({
  baseURL: 'https://umais-chat-app.bonto.run/api',
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