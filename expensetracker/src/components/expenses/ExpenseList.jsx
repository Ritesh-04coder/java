import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { 
  fetchExpenses, 
  deleteExpense, 
  updateExpense,
  fetchCategories
} from '../../api/api';
import { formatCurrency } from '../../utils/formatters';
import { Pencil, Trash2, Save, X } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const ExpenseList = ({ refresh, selectedCategory }) => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    description: '',
    amount: '',
    date: '',
    category: '',
    notes: ''
  });

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [expensesRes, categoriesRes] = await Promise.all([
          fetchExpenses(selectedCategory),
          fetchCategories()
        ]);
        setExpenses(expensesRes.data);
        setCategories(categoriesRes.data);
        setError('');
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load initial data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedCategory]);

  const fetchExpensesData = useCallback(async () => {
    try {
      const res = await fetchExpenses(selectedCategory);
      setExpenses(res.data);
      setError('');
      toast.success('Expenses updated successfully');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch expenses');
      console.error(err);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchExpensesData();
  }, [fetchExpensesData, refresh]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        await fetchExpensesData();
        toast.success('Expense deleted successfully');
      } catch (err) {
        setError(err.message);
        toast.error('Failed to delete expense');
        console.error(err);
      }
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setEditForm({
      description: expense.description,
      amount: expense.amount,
      date: format(new Date(expense.date), 'yyyy-MM-dd'),
      category: expense.category,
      notes: expense.notes || ''
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || '' : value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateExpense(editingId, {
        ...editForm,
        amount: parseFloat(editForm.amount)
      });
      setEditingId(null);
      await fetchExpensesData();
      toast.success('Expense updated successfully');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to update expense');
      console.error(err);
    }
  };

  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-slate-800/50 rounded-xl border border-slate-700/30"></div>
      ))}
    </div>
  );

  if (loading) return <SkeletonLoader />;

  if (error) {
    return (
      <div className="bg-red-900/30 border-l-4 border-red-500 text-red-400 p-4 rounded-lg mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl shadow-lg border border-slate-700/30 backdrop-blur-sm">
      {/* Mobile View */}
      <div className="md:hidden grid gap-4 p-4">
        {expenses.map((expense) => (
          <div key={expense.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/30">
            {editingId === expense.id ? (
              <EditForm 
                editForm={editForm}
                handleEditFormChange={handleEditFormChange}
                handleUpdate={handleUpdate}
                cancelEdit={() => setEditingId(null)}
                categories={categories}
              />
            ) : (
              <MobileCard
                expense={expense}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700/30">
          <thead className="bg-slate-800/50">
            <tr>
              {['Date', 'Description', 'Category', 'Amount', 'Actions'].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-700/30">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-slate-800/30 transition-colors duration-200">
                {editingId === expense.id ? (
                  <td colSpan="5" className="px-6 py-4">
                    <EditForm 
                      editForm={editForm}
                      handleEditFormChange={handleEditFormChange}
                      handleUpdate={handleUpdate}
                      cancelEdit={() => setEditingId(null)}
                      categories={categories}
                    />
                  </td>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {format(new Date(expense.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-400 font-medium">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-slate-300 hover:text-emerald-400 mr-4 transition-colors duration-200"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-slate-300 hover:text-red-400 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Sub-components
const MobileCard = ({ expense, handleEdit, handleDelete }) => (
  <>
    <div className="flex justify-between mb-2">
      <span className="font-medium text-slate-200">{expense.description}</span>
      <span className="text-emerald-400">{formatCurrency(expense.amount)}</span>
    </div>
    <div className="flex justify-between text-sm text-slate-400">
      <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
      <span className="px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
        {expense.category}
      </span>
    </div>
    <div className="mt-2 flex justify-end space-x-2">
      <button
        onClick={() => handleEdit(expense)}
        className="text-sm text-slate-300 hover:text-emerald-400 transition-colors duration-200"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDelete(expense.id)}
        className="text-sm text-slate-300 hover:text-red-400 transition-colors duration-200"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </>
);

const EditForm = ({ editForm, handleEditFormChange, handleUpdate, cancelEdit, categories }) => (
  <form onSubmit={handleUpdate} className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-300">
          Description
        </label>
        <input
          type="text"
          name="description"
          value={editForm.description}
          onChange={handleEditFormChange}
          className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/50 focus:border-emerald-500 focus:ring focus:ring-emerald-500/20 focus:ring-opacity-50 transition-all duration-200 text-slate-200 placeholder-slate-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300">
          Amount
        </label>
        <input
          type="number"
          name="amount"
          value={editForm.amount}
          onChange={handleEditFormChange}
          className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/50 focus:border-emerald-500 focus:ring focus:ring-emerald-500/20 focus:ring-opacity-50 transition-all duration-200 text-slate-200 placeholder-slate-400"
          step="0.01"
          min="0.01"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={editForm.date}
          onChange={handleEditFormChange}
          className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/50 focus:border-emerald-500 focus:ring focus:ring-emerald-500/20 focus:ring-opacity-50 transition-all duration-200 text-slate-200"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300">
          Category
        </label>
        <select
          name="category"
          value={editForm.category}
          onChange={handleEditFormChange}
          className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/50 focus:border-emerald-500 focus:ring focus:ring-emerald-500/20 focus:ring-opacity-50 transition-all duration-200 text-slate-200"
          required
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category.id} value={category.name} className="bg-slate-800">
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>

    <div className="flex justify-end space-x-3">
      <button
        type="button"
        onClick={cancelEdit}
        className="inline-flex items-center px-4 py-2 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800/50 hover:text-red-400 hover:border-red-400/20 transition-all duration-200 gap-2"
      >
        <X className="w-4 h-4" />
        Cancel
      </button>
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 gap-2"
      >
        <Save className="w-4 h-4" />
        Save Changes
      </button>
    </div>
  </form>
);

export default ExpenseList;