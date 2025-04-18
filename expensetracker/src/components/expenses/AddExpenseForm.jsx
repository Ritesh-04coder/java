import { useState, useEffect } from 'react';
import { expenseService } from '../../services/expenseService';
import { PlusCircle } from 'lucide-react';

const initialFormState = {
  description: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  categoryId: '',
  notes: ''
};

const AddExpenseForm = ({ onExpenseAdded }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await expenseService.getCategories();
        if (data && data.length > 0) {
          setCategories(data);
          setFormData(prev => ({
            ...prev,
            categoryId: data[0].id.toString()
          }));
        } else {
          console.warn('No categories returned from backend');
        }
      } catch (err) {
        console.error('Could not fetch categories, using defaults', err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.description || !formData.amount || !formData.date || !formData.categoryId) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.description.length > 255) {
        throw new Error('Description must be less than 255 characters');
      }
      
      if (formData.notes && formData.notes.length > 500) {
        throw new Error('Notes must be less than 500 characters');
      }

      const newExpense = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: formData.date,
        categoryId: parseInt(formData.categoryId, 10),
        notes: formData.notes || null
      };

      const response = await expenseService.addExpense(newExpense);
      
      setSuccess('Expense added successfully!');
      setFormData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        categoryId: formData.categoryId,
        notes: ''
      });
      
      if (onExpenseAdded) {
        onExpenseAdded(response);
      }
    } catch (err) {
      setError(err.message || 'Failed to add expense');
    } finally {
      setLoading(false);
      
      if (success) {
        setTimeout(() => setSuccess(''), 3000);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-2xl shadow-lg border border-slate-700/30 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <PlusCircle className="w-8 h-8 text-emerald-400" />
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Add New Expense
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border-l-4 border-red-500 text-red-400 p-4 rounded-lg mb-6 animate-fade-in">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-emerald-900/30 border-l-4 border-emerald-500 text-emerald-400 p-4 rounded-lg mb-6 animate-fade-in">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-slate-300 font-medium" htmlFor="description">
                Description <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/50 focus:border-emerald-500 focus:ring focus:ring-emerald-500/20 focus:ring-opacity-50 transition-all duration-200 text-slate-200 placeholder-slate-400"
                required
                placeholder="Enter expense description"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-slate-300 font-medium" htmlFor="amount">
                Amount ($) <span className="text-emerald-400">*</span>
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/50 focus:border-emerald-500 focus:ring focus:ring-emerald-500/20 focus:ring-opacity-50 transition-all duration-200 text-slate-200 placeholder-slate-400"
                required
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-slate-300 font-medium" htmlFor="date">
                Date <span className="text-emerald-400">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/50 focus:border-emerald-500 focus:ring focus:ring-emerald-500/20 focus:ring-opacity-50 transition-all duration-200 text-slate-200"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-slate-300 font-medium" htmlFor="categoryId">
                Category <span className="text-emerald-400">*</span>
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/50 focus:border-emerald-500 focus:ring focus:ring-emerald-500/20 focus:ring-opacity-50 transition-all duration-200 text-slate-200"
                required
              >
                <option value="">-- Select a Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-slate-800">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <label className="block text-slate-300 font-medium" htmlFor="notes">
                Notes <span className="text-slate-400 text-sm font-normal">(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/50 focus:border-emerald-500 focus:ring focus:ring-emerald-500/20 focus:ring-opacity-50 transition-all duration-200 resize-none text-slate-200 placeholder-slate-400"
                placeholder="Add any additional notes here..."
              ></textarea>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-70 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 font-medium"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  <span>Add Expense</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseForm;