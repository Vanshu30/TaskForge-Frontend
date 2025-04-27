
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { AuthProvider } from "@/context/AuthContext";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { HelmetProvider } from 'react-helmet-async';
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
// import Index from "./pages/Index";
// import Issues from "./pages/Issues";
// import Login from "./pages/Login";
// import NotFound from "./pages/NotFound";
// import PackageSelection from "./pages/PackageSelection";
// import Profile from "./pages/Profile";
// import ProjectDetail from "./pages/ProjectDetail";
// import Projects from "./pages/Projects";
// import ProjectSettings from "./pages/ProjectSettings";
// import Settings from "./pages/Settings";
// import Signup from "./pages/Signup";
// import Tasks from "./pages/Tasks";
// import Teams from "./pages/Teams";

// const queryClient = new QueryClient();

// const App = () => {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <HelmetProvider>
//         <BrowserRouter>
//           <AuthProvider>
//             <TooltipProvider>
//               <Toaster />
//               <Sonner />
//               <Routes>
//                 <Route path="/" element={<Index />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/signup" element={<Signup />} />
//                 <Route path="/package-selection" element={<PackageSelection />} />
//                 <Route path="/dashboard" element={<Dashboard />} />
//                 <Route path="/projects" element={<Projects />} />
//                 <Route path="/projects/:projectId" element={<ProjectDetail />} />
//                 <Route path="/projects/:projectId/settings" element={<ProjectSettings />} />
//                 <Route path="/profile" element={<Profile />} />
//                 <Route path="/settings" element={<Settings />} />
//                 <Route path="/issues" element={<Issues />} />
//                 <Route path="/tasks" element={<Tasks />} />
//                 <Route path="/teams" element={<Teams />} />
//                 <Route path="*" element={<NotFound />} />
//               </Routes>
//             </TooltipProvider>
//           </AuthProvider>
//         </BrowserRouter>
//       </HelmetProvider>
//     </QueryClientProvider>
//   );
// };

// export default App;

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Issues from "./pages/Issues";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PackageSelection from "./pages/PackageSelection";
import Profile from "./pages/Profile";
import ProjectDetail from "./pages/ProjectDetail";
import Projects from "./pages/Projects";
import ProjectSettings from "./pages/ProjectSettings";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import Tasks from "./pages/Tasks";
import Teams from "./pages/Teams";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Store current path for redirect after login
    sessionStorage.setItem('redirectUrl', location.pathname);
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Redirect handler component
const RedirectHandler = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    if (isAuthenticated && location.pathname === "/login") {
      const redirectUrl = sessionStorage.getItem('redirectUrl');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectUrl');
        window.location.href = redirectUrl;
      } else {
        window.location.href = "/dashboard";
      }
    }
  }, [isAuthenticated, location.pathname]);
  
  return null;
};

const AppRoutes = () => {
  return (
    <>
      <RedirectHandler />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/package-selection" element={<PackageSelection />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/projects" element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        } />
        <Route path="/projects/:projectId" element={
          <ProtectedRoute>
            <ProjectDetail />
          </ProtectedRoute>
        } />
        <Route path="/projects/:projectId/settings" element={
          <ProtectedRoute>
            <ProjectSettings />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/issues" element={
          <ProtectedRoute>
            <Issues />
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        } />
        <Route path="/teams" element={
          <ProtectedRoute>
            <Teams />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppRoutes />
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;