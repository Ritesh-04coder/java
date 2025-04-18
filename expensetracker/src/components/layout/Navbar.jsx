import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/30 shadow-lg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <NavLink 
              to="/app"
              className={({ isActive }) => 
                `inline-flex items-center px-4 py-2 mt-2 text-sm font-medium rounded-xl transition-all duration-200 gap-2 hover:bg-slate-800/50 ${
                  isActive 
                    ? 'text-emerald-400 bg-slate-800/50 border border-emerald-500/20' 
                    : 'text-slate-300 hover:text-emerald-400'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </NavLink>
            <NavLink 
              to="/app/expenses"
              className={({ isActive }) => 
                `inline-flex items-center px-4 py-2 mt-2 text-sm font-medium rounded-xl transition-all duration-200 gap-2 hover:bg-slate-800/50 ${
                  isActive 
                    ? 'text-emerald-400 bg-slate-800/50 border border-emerald-500/20' 
                    : 'text-slate-300 hover:text-emerald-400'
                }`
              }
            >
              <Receipt className="w-4 h-4" />
              Expenses
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}