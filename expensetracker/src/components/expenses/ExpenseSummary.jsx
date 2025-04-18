// src/components/expenses/ExpenseSummary.jsx
import { useState, useEffect } from 'react';
import { expenseService } from '../../services/expenseService';
import { formatCurrency, getCurrentMonthYear, getMonthOptions, getYearOptions } from '../../utils/formatters';

const getCategoryColor = (category) => {
  const colors = {
    Food: '#4CAF50',
    Housing: '#2196F3',
    Transportation: '#FF9800',
    Entertainment: '#9C27B0',
    Healthcare: '#F44336',
    Utilities: '#607D8B',
    Shopping: '#E91E63',
    Travel: '#00BCD4',
    Education: '#8BC34A',
    Personal: '#FFEB3B'
  };
  return colors[category] || '#9E9E9E';
};

const ExpenseSummary = () => {
  const { month, year } = getCurrentMonthYear();
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const monthOptions = getMonthOptions();
  const yearOptions = getYearOptions();

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const data = await expenseService.getMonthlySummary(selectedYear, selectedMonth);
        setSummary(data);
        setError('');
      } catch (err) {
        console.error('Error fetching summary:', err);
        setError(err.message || 'Failed to fetch summary');
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [selectedMonth, selectedYear]);

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value, 10));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Monthly Expense Summary</h2>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
            Month
          </label>
          <select
            id="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <select
            id="year"
            value={selectedYear}
            onChange={handleYearChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {yearOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading summary...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : !summary ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-center">
          No expense data available for this month.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="text-sm text-blue-800 font-medium uppercase">Total Expenses</h3>
              <p className="text-2xl font-bold text-blue-700">{formatCurrency(summary.totalAmount)}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="text-sm text-green-800 font-medium uppercase">Transactions</h3>
              <p className="text-2xl font-bold text-green-700">{summary.totalCount}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h3 className="text-sm text-purple-800 font-medium uppercase">Average</h3>
              <p className="text-2xl font-bold text-purple-700">
                {summary.totalCount > 0 
                  ? formatCurrency(summary.totalAmount / summary.totalCount) 
                  : formatCurrency(0)}
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Spending by Category</h3>
            {summary.byCategory && Object.keys(summary.byCategory).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(summary.byCategory).map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: getCategoryColor(category) }}
                      />
                      <span>{category}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">{formatCurrency(amount)}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        ({Math.round((amount / summary.totalAmount) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No category data available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSummary;