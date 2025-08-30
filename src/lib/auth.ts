import axios from "axios";

// Configure axios defaults
const API_BASE_URL = "http://localhost:8080/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth types
export interface User {
  id: string;
  username: string;  // ✅ real name
  email: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;   // ✅ use username instead of name
  email: string;
  password: string;
}

// Auth API calls
export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post("/auth/login", {
      username: credentials.email, // Spring Security uses "username"
      password: credentials.password,
    });
    return response.data; // { token }
  },

  register: async (credentials: RegisterCredentials) => {
    const response = await api.post("/auth/register", {
      username: credentials.username, // ✅ real name goes here
      email: credentials.email,
      password: credentials.password,
    });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// Token management
export const tokenManager = {
  setToken: (token: string) => {
    localStorage.setItem("token", token);
  },
  getToken: () => localStorage.getItem("token"),
  removeToken: () => localStorage.removeItem("token"),
  isAuthenticated: () => !!localStorage.getItem("token"),
};
