import React from "react";
import { FaProjectDiagram, FaTasks, FaUser, FaTimes, FaBars, FaTimes, FaBars, FaTimes, FaBars, FaTimes, FaBars, FaTimes, FaBars, FaTimes, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useTheme } from "../context/ThemeContext";
import { useTheme } from "../context/ThemeContext";
import { useTheme } from "../context/ThemeContext";
import { useTheme } from "../context/ThemeContext";
import { useTheme } from "../context/ThemeContext";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { theme } = useTheme();
  
  const { theme } = useTheme();
  
  const { theme } = useTheme();
  
  return (
      <nav 
          </div>
      </div>
      </div>
        
        className={`{`sidebar fixed h-full transition-all duration-300 z-10 ${
      isOpen ? "left-0" : "-left-64"
    } ${
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    } w-64 shadow-lg`}>
      <but absolute top-4 right-4 p-2 rounded-full ${
          theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`} 
      </div>
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </bu space-y-4tton>
      
      <div className="p-6 pt-12">
        <h2 className="text-xl font-bold mb-6">Navigation</h2>
          className={`toggle-btn absolute top-4 right-4 p-2 rounded-full ${
          theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
        }`} 
  }
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
      </div>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
      
      <div className="p-6 pt-12">
        <h2 className="text-xl font-bold mb-6">Navigation</h2>
        <ul className="sidebar-menu space-y-4">
          <li>
            <Link 
              to="/projects" 
              className={`flex items-center gap-3 p-2 rounded ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              } transition-colors`}
            >
              <FaProjectDiagram /> Projects
            </Link>
          </li>
          <li>
            <Link 
              to="/tasks" 
              className={`flex items-center gap-3 p-2 rounded ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              } transition-colors`}
            >
              <FaTasks /> Tasks
            </Link>
          </li>
          <li>
            <Link 
              to="/profile" 
              className={`flex items-center gap-3 p-2 rounded ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              } transition-colors`}
            >
              <FaUser /> Profile
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
