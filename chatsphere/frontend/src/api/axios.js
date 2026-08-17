import axios from 'axios';

const API = axios.create({
  baseURL: 'https://chatapp1-hpaik4df.b4a.run/api',
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