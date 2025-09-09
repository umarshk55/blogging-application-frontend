import axios from "axios";
import { getToken } from "../auth";

export const BASE_URL = "http://localhost:9090/api/v1";

// Public axios instance
export const myAxios = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Private axios instance
export const privateAxios = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor to attach JWT
privateAxios.interceptors.request.use(
  (config) => {
    const token = getToken(); // <-- must return only the token string
    console.log("Token from interceptor:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
