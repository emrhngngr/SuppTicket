import React, { useState, useContext } from 'react';
import { Sun, Moon, Menu, Bell, Search, User, Settings, LogOut } from 'lucide-react';
import { ThemeContext } from '../../../context/ThemeContext';

const Topbar = () => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  // Handle sidebar toggle for mobile (communicates with parent component)
  const toggleSidebar = () => {
    // This function would be passed from the parent component
    // For simplicity, we'll just define it here
    document.dispatchEvent(new CustomEvent('toggle-sidebar'));
  };

  // Handle profile dropdown
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar} 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white mr-4 lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search..." 
                className="input input-bordered bg-gray-100 dark:bg-gray-700 pl-10 py-2 h-10 w-64"
              />
            </div>
          </div>
          
          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? (
                <Sun size={20} className="text-gray-400" />
              ) : (
                <Moon size={20} className="text-gray-600" />
              )}
            </button>
            
            {/* Notification Bell */}
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
              <Bell size={20} className="text-gray-600 dark:text-gray-400" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                  <img 
                    src="/api/placeholder/32/32" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
              
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border dark:border-gray-700">
                  <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                    <User size={16} className="mr-2" />
                    Profile
                  </a>
                  <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                    <Settings size={16} className="mr-2" />
                    Settings
                  </a>
                  <div className="border-t dark:border-gray-700"></div>
                  <a onClick={() => handleLogout()} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;