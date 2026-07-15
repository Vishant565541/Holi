import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

// Automatically inject JWT authentication headers
API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const storage = localStorage.getItem("aura-auth-storage");
      if (storage) {
        try {
          const parsed = JSON.parse(storage);
          // Zustand wraps the state inside a .state node
          const token = parsed?.state?.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (e) {
          console.error("Failed to parse auth token:", e);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
