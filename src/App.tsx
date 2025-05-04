// src\App.tsx
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import CreateCompany from "@/pages/CreateCompany";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { Route, Routes, useLocation } from "react-router-dom";
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import CreateProject from "./pages/CreateProject";
import Dashboard from "./pages/Dashboard";
import GenerateInviteLink from "./pages/GenerateInviteLink";
import Index from "./pages/Index";
import InviteMember from "./pages/InviteMember";
import Issues from "./pages/Issues";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PackageSelection from "./pages/PackageSelection";
import Profile from "./pages/Profile";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectsPage from "./pages/projects";
import ProjectSettings from "./pages/ProjectSettings";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import Tasks from "./pages/Tasks";
import Teams from "./pages/Teams";
import UpdateProject from "./pages/UpdateProject";
import ValidateInvite from "./pages/ValidateInvite";

const queryClient = new QueryClient();

const App = () => {
  const location = useLocation();
  const isIndexPage = location.pathname === '/';

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
                {!isIndexPage && <Navbar />}
                <main className="flex-grow container mx-auto p-6">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/create-company" element={<CreateCompany />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/package-selection" element={<PackageSelection />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/invite" element={<InviteMember />} />
                    <Route path="/generate-invite-link" element={<GenerateInviteLink />} />
                    <Route path="/accept-invite" element={<ValidateInvite />} />
                    <Route path="/teams" element={<Teams />} />
                    <Route path="/create-project" element={<CreateProject />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/update-project/:id" element={<UpdateProject />} />
                    <Route path="/projects/:projectId" element={<ProjectDetail />} />
                    <Route path="/projects/:projectId/settings" element={<ProjectSettings />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/issues" element={<Issues />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                {!isIndexPage && <Footer />}
              </div>
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
