import React from "react";
import { FaMoon, FaSun } from "react-icons/fa"; // Icons for light/dark mode toggle
import { useTheme } from "../context/ThemeContext";
import { useTheme } from "../context/ThemeContext";
import { useTheme } from "../context/ThemeContext";
import { useTheme } from "../context/ThemeContext";
import { useTheme } from "../context/ThemeContext";
import { useTheme } from "../context/ThemeContext";

interface TopbarProps {
  toggleTheme: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ toggleTheme }) => {
  const { theme } = useTheme();
  
  const { theme } = useTheme();
  
  const { theme } = useTheme();
  
  const { theme } = useTheme();
  
  return (
    <header 
        
        className={`topbar ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-4 flex justify-between items-center shadow-md`} ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-4 flex justify-between items-center shadow-md`} ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-4 flex justify-between items-center shadow-md`} ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-4 flex justify-between items-center shadow-md`}>
      <div className="logo font-bold text-xl">TaskForge</div>
      <button 
        className="theme-toggle p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" 
  
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <FaMoon className="text-gray-700" /> : <FaSun className="text-yellow-400" />}
      </button>
    </header>
  );
};

export default Topbar;