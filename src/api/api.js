// src/api.js
import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  // baseURL: "http://localhost:8080/api/mas",  //local URL
  baseURL: "https://exam-omr.onrender.com/api/mas", // prod URL
});

// 🔹 Request interceptor → attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔹 Response interceptor → handle session expiry (408)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 408) {
      localStorage.clear();
      toast.error("Session expired, please login again");
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default api;
