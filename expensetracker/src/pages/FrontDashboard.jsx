import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Clock, Activity, ArrowRight, ChevronRight, Users, LineChart } from 'lucide-react';

const FrontDashboard = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform duration-300" />,
      title: 'Advanced Protection',
      description: 'Multi-layered security system to protect your transactions.',
      gradient: 'from-emerald-500/20 to-teal-500/20'
    },
    {
      icon: <Clock className="w-8 h-8 text-rose-500 group-hover:scale-110 transition-transform duration-300" />,
      title: 'Real-Time Monitoring',
      description: '24/7 transaction monitoring and instant alerts.',
      gradient: 'from-rose-500/20 to-pink-500/20'
    },
    {
      icon: <Activity className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform duration-300" />,
      title: 'Smart Analytics',
      description: 'AI-powered fraud pattern detection and analysis.',
      gradient: 'from-amber-500/20 to-orange-500/20'
    },
  ];

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Login', to: '/login' },
    { label: 'Dashboard', to: '/app' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Navbar */}
      <nav className="bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-500/30 transition-all duration-300"></div>
              <Shield className="w-8 h-8 text-emerald-400 mr-2 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="font-bold text-xl text-white group-hover:text-emerald-400 transition-colors duration-300">
              Expense Tracker
            </span>
          </div>
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="relative text-slate-300 hover:text-emerald-400 transition-colors duration-300 py-2 px-4 rounded-full hover:bg-emerald-500/10"
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="lg:w-1/2 text-left relative">
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <div className="inline-flex items-center bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-4 py-2 rounded-full mb-6 hover:from-emerald-500/20 hover:to-teal-500/20 transition-colors duration-300 cursor-pointer group">
                <AlertTriangle className="w-4 h-4 text-emerald-400 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-sm text-emerald-400 font-medium">Smart Expense Management</span>
              </div>
              <h1 className="text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                Track Every
                <span className="block mt-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Dollar Spent
                </span>
              </h1>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                Take control of your finances with real-time tracking, smart analytics, and predictive insights.
              </p>
              <div className="flex gap-6">
                <Link
                  to="/login"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-full hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Started
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <button className="px-8 py-4 bg-slate-800 text-emerald-400 font-semibold rounded-full border-2 border-emerald-500/20 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg">
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-3xl transform rotate-3 scale-105 opacity-20 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500 blur-xl"></div>
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
                alt="Dashboard Preview"
                className="rounded-3xl shadow-2xl relative z-10 transform transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-slate-800/50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden backdrop-blur-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${feature.gradient}"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative py-20 mt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1920&q=80')] opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { icon: <Shield className="w-8 h-8" />, value: '99.9%', label: 'Security Rate' },
              { icon: <Users className="w-8 h-8" />, value: '50K+', label: 'Active Users' },
              { icon: <LineChart className="w-8 h-8" />, value: '$2M+', label: 'Tracked Monthly' },
              { icon: <Activity className="w-8 h-8" />, value: '24/7', label: 'Monitoring' },
            ].map((stat, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-white/10 backdrop-blur-lg transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                <div className="flex justify-center mb-4">
                  <div className="text-white/80 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-emerald-100 group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontDashboard;