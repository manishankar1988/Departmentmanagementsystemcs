// src/api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://department-management-system-cse-sahrdaya.onrender.com/api", // your Render backend URL
});
API.interceptors.request.use((req) => {
  const user = localStorage.getItem("user");
  if (user) req.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
  return req;
});

export default API;
