import React, { useState } from 'react';
import { Home, BarChart2, Users, FileText, Calendar, X } from 'lucide-react';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Handle sidebar toggle for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Navigation items for sidebar
  const navItems = [
    { name: 'Dashboard', icon: <Home size={20} />, href: '/dashboard' },
    { name: 'Topics', icon: <FileText size={20} />, href: '/topics' },
    { name: 'Tickets', icon: <FileText size={20} />, href: '/tickets' },
    { name: 'Users', icon: <Users size={20} />, href: '/users' },
    { name: 'Analytics', icon: <BarChart2 size={20} />, href: '/analytics' },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 lg:relative transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
      <div className="flex flex-col h-full w-64 bg-white dark:bg-gray-800 shadow-lg">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">Dashboard</span>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <a 
                  href={item.href} 
                  className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <span className="text-gray-500 dark:text-gray-400">{item.icon}</span>
                  <span className="ml-3">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <img 
                src="/api/placeholder/40/40" 
                alt="User Avatar" 
                className="object-cover w-full h-full"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800 dark:text-white">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;