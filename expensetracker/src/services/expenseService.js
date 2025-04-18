const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api';
console.log(">>> API_URL:", import.meta.env.VITE_BACKEND_URL);


// Generic response handler
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({})); // Handle non-JSON responses
  if (!response.ok) {
    const error = new Error(data.message || `HTTP Error ${response.status}`);
    error.status = response.status;
    error.details = data;
    throw error;
  }
  return data;
};

export const expenseService = {
  // Fetch all expenses
  getAllExpenses: async () => {
    try {
      const response = await fetch(`${API_URL}/expenses`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching expenses:', error.message, error.details);
      throw error;
    }
  },

  // Fetch expenses by category
  getExpensesByCategory: async (category) => {
    try {
      const response = await fetch(`${API_URL}/expenses?category=${encodeURIComponent(category)}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching by category:', error.message, error.details);
      throw error;
    }
  },

  // Add a new expense (with enhanced error handling)
  addExpense: async (expense) => {
    try {
      // Updated validation: ensure amount, categoryId, and date are provided
      if (!expense.amount || !expense.categoryId || !expense.date) {
        throw new Error('Missing required expense fields');
      }

      const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error adding expense:', {
        message: error.message,
        details: error.details || error.stack,
        sentData: expense
      });
      throw error;
    }
  },

  // Delete an expense
  deleteExpense: async (id) => {
    try {
      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: 'DELETE',
      });
      await handleResponse(response);
      return true;
    } catch (error) {
      console.error('Error deleting expense:', error.message, error.details);
      throw error;
    }
  },

  // Update an expense
  updateExpense: async (id, expense) => {
    try {
      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating expense:', error.message, error.details);
      throw error;
    }
  },

  // Get monthly summary (using query parameters)
  getMonthlySummary: async (year, month) => {
    try {
      const response = await fetch(
        `${API_URL}/expenses/summary?year=${year}&month=${String(month).padStart(2, '0')}`
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching monthly summary:', error.message, error.details);
      throw error;
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching categories:', error.message, error.details);
      throw error;
    }
  }
};

console.log("API URL being used:", API_URL);

