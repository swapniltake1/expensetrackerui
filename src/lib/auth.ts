// src/lib/auth.ts
import axios from "axios";

// ---------------- Token Management ----------------
export const tokenManager = {
  getToken: (): string | null => localStorage.getItem("token"),
  setToken: (token: string) => localStorage.setItem("token", token),
  removeToken: () => localStorage.removeItem("token"),
};

// ---------------- User & Credential Types ----------------
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

// ---------------- Axios Instance ----------------
export const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// Add token automatically to requests
api.interceptors.request.use((config) => {
  const token = tokenManager.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------- Auth API ----------------
export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const res = await api.post("/auth/login", credentials);
    if (!res.data?.token) throw new Error("Login failed");
    tokenManager.setToken(res.data.token);
    return res.data;
  },

  register: async (credentials: RegisterCredentials) => {
    const res = await api.post("/auth/register", credentials);
    if (!res.data?.token) throw new Error("Registration failed");
    tokenManager.setToken(res.data.token);
    return res.data;
  },

  getProfile: async (): Promise<User> => {
    const res = await api.get("/auth/me");
    return res.data;
  },

  logout: () => {
    tokenManager.removeToken();
  },
};
