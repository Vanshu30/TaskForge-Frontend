import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useTheme } from "../context/ThemeContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const containerClasses = `app-layout ${theme} min-h-screen flex flex-col`;
  const contentClasses = `flex flex-1 transition-colors duration-300 ${
    isSidebarOpen ? 'ml-64' : 'ml-0'
  } ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`;

  return (
    <div className={containerClasses}>
      <Topbar toggleTheme={toggleTheme} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className={contentClasses}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
