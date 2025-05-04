import React, { ReactNode } from "react";
import Topbar from "../components/Topbar";
import { useTheme } from "../context/ThemeContext";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`app-layout ${theme} min-h-screen flex flex-col`}>
      <Topbar toggleTheme={toggleTheme} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;