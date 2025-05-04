import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer"; // ensure this import exists
import Topbar from "../components/Topbar";
import { useTheme } from "../context/ThemeContext";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isLandingPage = location.pathname === "/";

  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground ${theme}`}>
      {!isLandingPage && <Topbar toggleTheme={toggleTheme} />}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      {!isLandingPage && <Footer />}
    </div>
  );
};

export default AppLayout;