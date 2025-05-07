import { LogOut } from "lucide-react";
import React from "react";

const Navbar = () => {
  const handleLogout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };
  return (
    <div className="flex justify-center">
      <nav className="flex items-center justify-center h-16 px-4 text-white">
        <ul className="flex space-x-4 text-black font-semibold">
          <a href="/home" className="hover:bg-accent px-4 py-2 rounded">
            <li>Home</li>
          </a>
          <a href="/topics" className="hover:bg-accent px-4 py-2 rounded">
            <li>Topics</li>
          </a>
          <a href="/tickets" className="hover:bg-accent px-4 py-2 rounded">
            <li>Tickets</li>
          </a>
        </ul>
        <div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
