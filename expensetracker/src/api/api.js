// src/api/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add these missing endpoints
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
export const updateExpense = (id, expenseData) => api.put(`/expenses/${id}`, expenseData);

// Existing endpoints
export const fetchExpenses = (category) => api.get('/expenses', { params: { category } });
export const createExpense = (expenseData) => api.post('/expenses', expenseData);
export const getMonthlySummary = (year, month) => api.get('/expenses/summary', { params: { year, month } });
export const fetchCategories = () => api.get('/categories');
export const createCategory = (categoryData) => api.post('/categories', categoryData);

export default api;