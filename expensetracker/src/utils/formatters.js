// src/utils/formatters.js

// Format currency
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Format date
  export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Get current month and year
  export const getCurrentMonthYear = () => {
    const now = new Date();
    return {
      month: now.getMonth() + 1, // JavaScript months are 0-indexed
      year: now.getFullYear()
    };
  };
  
  // Generate month options for dropdowns
  export const getMonthOptions = () => {
    return [
      { value: 1, label: 'January' },
      { value: 2, label: 'February' },
      { value: 3, label: 'March' },
      { value: 4, label: 'April' },
      { value: 5, label: 'May' },
      { value: 6, label: 'June' },
      { value: 7, label: 'July' },
      { value: 8, label: 'August' },
      { value: 9, label: 'September' },
      { value: 10, label: 'October' },
      { value: 11, label: 'November' },
      { value: 12, label: 'December' }
    ];
  };
  
  // Generate year options (current year and 4 years back)
  export const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => ({
      value: currentYear - i,
      label: `${currentYear - i}`
    }));
  };
  
  // Default expense categories
  export const DEFAULT_CATEGORIES = [
    'Food',
    'Rent',
    'Transportation',
    'Entertainment',
    'Utilities',
    'Clothing',
    'Education',
    'Healthcare',
    'Other'
  ];
  
  // Generate color for categories (for charts)
  export const getCategoryColor = (category) => {
    const colors = {
      Food: '#FF6384',
      Rent: '#36A2EB',
      Transportation: '#FFCE56',
      Entertainment: '#4BC0C0',
      Utilities: '#9966FF',
      Clothing: '#FF9F40',
      Education: '#C9CBCF',
      Healthcare: '#7BC043',
      Other: '#8B572A'
    };
    
    return colors[category] || '#999999';
  };