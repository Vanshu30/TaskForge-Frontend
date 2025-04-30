import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

// Define the shape of the context
export interface AuthContextType {
  user: any;
  token: string | null;
  login: (newToken: string) => void;
  logout: () => void;
}

// Create a default context value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);


// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // You can load token/user from localStorage here if needed
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setUser({ name: "Sample User" }); // Replace with real user fetching logic
    }
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    setUser({ name: "Sample User" }); // Replace with actual login logic
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for consuming the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
