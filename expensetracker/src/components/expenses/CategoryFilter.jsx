import { useState, useEffect } from 'react';
import { expenseService } from '../../services/expenseService';
import { DEFAULT_CATEGORIES } from '../../utils/formatters';
import { Filter } from 'lucide-react';

const CategoryFilter = ({ onCategoryChange }) => {
  const [categories, setCategories] = useState(['All', ...DEFAULT_CATEGORIES]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await expenseService.getCategories();
        if (data && data.length > 0) {
          const categoryNames = data.map(cat => cat.name);
          setCategories(['All', ...categoryNames]);
        }
      } catch (err) {
        console.error('Could not fetch categories, using defaults', err);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 rounded-xl shadow-md border border-indigo-100/20 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-indigo-600" />
          <label 
            htmlFor="category-filter" 
            className="text-gray-700 font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap"
          >
            Filter by Category
          </label>
        </div>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 bg-white/50 backdrop-blur-sm cursor-pointer hover:border-indigo-300"
        >
          {categories.map((category) => (
            <option 
              key={category} 
              value={category}
              className="bg-white text-gray-700"
            >
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CategoryFilter;