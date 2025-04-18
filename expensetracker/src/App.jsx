import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import FrontDashboard from './pages/FrontDashboard';
import Login from './pages/Login';
import Navbar from './components/layout/Navbar';
import AddExpenseForm from './components/expenses/AddExpenseForm';
import ExpenseList from './components/expenses/ExpenseList';
import CategoryFilter from './components/expenses/CategoryFilter';
import ExpenseSummary from './components/expenses/ExpenseSummary';
import ReportGenerator from './components/expenses/ReportGenerator';

// Moved Dashboard component outside
const Dashboard = ({ refreshExpenses }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
        <Link
          to="/app/expenses"
          className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add New Expense
        </Link>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
      <ExpenseList refresh={refreshExpenses} />
    </div>
  </div>
);

function App() {
  const [user, setUser] = useState(null);
  const [refreshExpenses, setRefreshExpenses] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleExpenseAdded = () => {
    setRefreshExpenses(prev => prev + 1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleLogin = (email) => {
    setUser(email);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" replace />;
  };

  const MainLayout = () => (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <Navbar onLogout={handleLogout} />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route index element={<Dashboard refreshExpenses={refreshExpenses} />} />
            <Route 
              path="expenses" 
              element={
                <div className="space-y-8">
                  <AddExpenseForm onExpenseAdded={handleExpenseAdded} />
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Your Expenses</h2>
                    <CategoryFilter onCategoryChange={handleCategoryChange} />
                    <ExpenseList 
                      refresh={refreshExpenses} 
                      selectedCategory={selectedCategory} 
                    />
                  </div>
                </div>
              } 
            />
            <Route path="summary" element={<ExpenseSummary />} />
            <Route path="reports" element={<ReportGenerator />} />
          </Routes>
        </main>
      </div>
    </ProtectedRoute>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FrontDashboard />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/app/*" element={<MainLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;