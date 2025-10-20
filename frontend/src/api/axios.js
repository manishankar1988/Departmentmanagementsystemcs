// src/api/axios.js
import axios from "axios";

// Use environment variable for backend URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token if user is logged in
API.interceptors.request.use((req) => {
  const user = localStorage.getItem("user");
  if (user) req.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
  return req;
});

export default API;
