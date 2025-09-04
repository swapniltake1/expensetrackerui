// src/lib/api.ts
import axios from "axios";
import { tokenManager } from "./auth";

// --------------------
// Types
// --------------------

// Expense types
export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt?: string;
}

export interface CreateExpenseRequest {
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface ExpenseFilters {
  start?: string;
  end?: string;
  category?: string;
}

// Budget types
export interface Budget {
  month: string;
  amount: number;
  spent: number;
}

export interface SetBudgetRequest {
  month: string;
  limitAmount: number; // must match backend DTO
}

// Categories - commonly used expense categories
export const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Travel',
  'Other'
] as const;

// --------------------
// Axios API instance
// --------------------
export const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token automatically to requests
api.interceptors.request.use((config) => {
  const token = tokenManager.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --------------------
// Expense API
// --------------------
export const expenseAPI = {
  getAll: async (filters?: ExpenseFilters) => {
    const params = new URLSearchParams();
    if (filters?.start) params.append("start", filters.start);
    if (filters?.end) params.append("end", filters.end);
    if (filters?.category) params.append("category", filters.category);

    const response = await api.get(`/expenses?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  create: async (expense: CreateExpenseRequest) => {
    const response = await api.post("/expenses/create", expense);
    return response.data;
  },

  update: async (id: string, expense: Partial<CreateExpenseRequest>) => {
    const response = await api.put(`/expenses/${id}`, expense);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/expenses/${id}`);
  },
};

// --------------------
// Budget API
// --------------------
export const budgetAPI = {
  set: async (budget: SetBudgetRequest) => {
    const response = await api.post("/budgets", budget);
    return response.data;
  },

  get: async (month: string) => {
    const response = await api.get(`/budgets/${month}`);
    return response.data;
  },
};
