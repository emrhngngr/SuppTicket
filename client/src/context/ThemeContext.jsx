import React, { createContext, useState, useEffect } from 'react';

// Create Theme Context
export const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Check for user's saved preference or system preference on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      setDarkMode(true);
    } else if (savedTheme === 'light') {
      setDarkMode(false);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Use system preference if no saved preference
      setDarkMode(true);
    }
  }, []);

  // Update HTML data-theme attribute and localStorage when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;