// src/components/expenses/ReportGenerator.jsx
import { useState } from 'react';
import { expenseService } from '../../services/expenseService';
import { formatCurrency, getMonthOptions, getYearOptions } from '../../utils/formatters';

const ReportGenerator = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const [filters, setFilters] = useState({
    startMonth: 1,
    startYear: currentYear,
    endMonth: currentMonth,
    endYear: currentYear,
    category: 'All'
  });
  
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const monthOptions = getMonthOptions();
  const yearOptions = getYearOptions();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: name.includes('Year') || name.includes('Month') ? parseInt(value) : value
    }));
  };

  const generateReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // We'll construct a report from multiple API calls
      let reportData = {
        totalExpenses: 0,
        monthlyBreakdown: [],
        categoryBreakdown: {},
        topExpenses: []
      };
      
      // This is a simplified approach - in a real app, you'd have a dedicated backend endpoint for this
      
      // Get all expenses within date range
      const allExpenses = await expenseService.getAllExpenses();
      
      // Filter by date range and category
      const filteredExpenses = allExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        
        // Remove the unused variables causing errors
        // const expenseYear = expenseDate.getFullYear();
        // const expenseMonth = expenseDate.getMonth() + 1;
        
        const startDate = new Date(filters.startYear, filters.startMonth - 1, 1);
        const endDate = new Date(filters.endYear, filters.endMonth, 0); // Last day of month
        
        const isInDateRange = expenseDate >= startDate && expenseDate <= endDate;
        const matchesCategory = filters.category === 'All' || expense.category === filters.category;
        
        return isInDateRange && matchesCategory;
      });
      
      // Calculate total
      reportData.totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      // Build monthly breakdown
      const monthlyData = {};
      filteredExpenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        const key = `${expenseDate.getFullYear()}-${expenseDate.getMonth() + 1}`;
        
        if (!monthlyData[key]) {
          monthlyData[key] = {
            year: expenseDate.getFullYear(),
            month: expenseDate.getMonth() + 1,
            monthName: monthOptions.find(m => m.value === expenseDate.getMonth() + 1)?.label,
            amount: 0
          };
        }
        
        monthlyData[key].amount += expense.amount;
      });
      
      reportData.monthlyBreakdown = Object.values(monthlyData).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      });
      
      // Build category breakdown
      const categoryData = {};
      filteredExpenses.forEach(expense => {
        if (!categoryData[expense.category]) {
          categoryData[expense.category] = 0;
        }
        categoryData[expense.category] += expense.amount;
      });
      
      reportData.categoryBreakdown = categoryData;
      
      // Get top expenses
      reportData.topExpenses = [...filteredExpenses]
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);
      
      setReportData(reportData);
      setError('');
    } catch (err) {
      setError('Failed to generate report. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!reportData) return;
    
    // Create report content
    let content = `# Expense Report\n\n`;
    content += `Period: ${monthOptions.find(m => m.value === filters.startMonth)?.label} ${filters.startYear} - ${monthOptions.find(m => m.value === filters.endMonth)?.label} ${filters.endYear}\n`;
    content += `Category: ${filters.category}\n\n`;
    
    content += `## Summary\n`;
    content += `Total Expenses: ${formatCurrency(reportData.totalExpenses)}\n\n`;
    
    content += `## Monthly Breakdown\n`;
    reportData.monthlyBreakdown.forEach(month => {
      content += `${month.monthName} ${month.year}: ${formatCurrency(month.amount)}\n`;
    });
    content += `\n`;
    
    content += `## Category Breakdown\n`;
    Object.entries(reportData.categoryBreakdown).forEach(([category, amount]) => {
      content += `${category}: ${formatCurrency(amount)}\n`;
    });
    content += `\n`;
    
    content += `## Top Expenses\n`;
    reportData.topExpenses.forEach((expense, index) => {
      content += `${index + 1}. ${expense.description} - ${formatCurrency(expense.amount)} (${expense.category})\n`;
    });
    
    // Create download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-report-${filters.startYear}-${filters.startMonth}-to-${filters.endYear}-${filters.endMonth}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Generate Expense Report</h2>
      
      <form onSubmit={generateReport} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-md font-medium mb-2">Start Period</h3>
            <div className="flex space-x-2">
              <div>
                <label htmlFor="startMonth" className="block text-sm text-gray-700 mb-1">Month</label>
                <select
                  id="startMonth"
                  name="startMonth"
                  value={filters.startMonth}
                  onChange={handleFilterChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {monthOptions.map(option => (
                    <option key={`start-${option.value}`} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="startYear" className="block text-sm text-gray-700 mb-1">Year</label>
                <select
                  id="startYear"
                  name="startYear"
                  value={filters.startYear}
                  onChange={handleFilterChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {yearOptions.map(option => (
                    <option key={`start-${option.value}`} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-2">End Period</h3>
            <div className="flex space-x-2">
              <div>
                <label htmlFor="endMonth" className="block text-sm text-gray-700 mb-1">Month</label>
                <select
                  id="endMonth"
                  name="endMonth"
                  value={filters.endMonth}
                  onChange={handleFilterChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {monthOptions.map(option => (
                    <option key={`end-${option.value}`} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="endYear" className="block text-sm text-gray-700 mb-1">Year</label>
                <select
                  id="endYear"
                  name="endYear"
                  value={filters.endYear}
                  onChange={handleFilterChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {yearOptions.map(option => (
                    <option key={`end-${option.value}`} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category (Optional)
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          >
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Clothing">Clothing</option>
            <option value="Education">Education</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {reportData && (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium text-blue-800">Report Summary</h3>
              <button
                onClick={downloadReport}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Download
              </button>
            </div>
            <p className="text-2xl font-bold text-blue-700 mt-2">
              {formatCurrency(reportData.totalExpenses)}
            </p>
            <p className="text-sm text-blue-600">
              {filters.category === 'All' ? 'All Categories' : filters.category} | 
              {' '}{monthOptions.find(m => m.value === filters.startMonth)?.label} {filters.startYear} - 
              {' '}{monthOptions.find(m => m.value === filters.endMonth)?.label} {filters.endYear}
            </p>
          </div>
          
          {reportData.monthlyBreakdown.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Monthly Breakdown</h3>
              <div className="space-y-2">
                {reportData.monthlyBreakdown.map((month) => (
                  <div 
                    key={`${month.year}-${month.month}`}
                    className="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span>{month.monthName} {month.year}</span>
                    <span className="font-medium">{formatCurrency(month.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {Object.keys(reportData.categoryBreakdown).length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Category Breakdown</h3>
              <div className="space-y-2">
                {Object.entries(reportData.categoryBreakdown).map(([category, amount]) => (
                  <div 
                    key={category}
                    className="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span>{category}</span>
                    <span className="font-medium">{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {reportData.topExpenses.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Top Expenses</h3>
              <div className="space-y-2">
                {reportData.topExpenses.map((expense) => (
                  <div 
                    key={expense.id}
                    className="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <div>
                      <span className="font-medium">{expense.description}</span>
                      <span className="text-sm text-gray-500 ml-2">({expense.category})</span>
                    </div>
                    <span className="font-medium">{formatCurrency(expense.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;