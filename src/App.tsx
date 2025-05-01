
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import CreateCompany from "@/pages/CreateCompany";
import CreateProject from "@/pages/CreateProject";
import GenerateInviteLink from "@/pages/GenerateInviteLink";
import Invite from "@/pages/Invite";
import InviteMember from "@/pages/InviteMember";
import UpdateProject from "@/pages/UpdateProject";
import ValidateInvite from "@/pages/ValidateInvite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { Route, Routes } from "react-router-dom";
import Footer from './components/Footer';
import Header from './components/Header';
import Projects from "./components/Projects";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Issues from "./pages/Issues";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PackageSelection from "./pages/PackageSelection";
import Profile from "./pages/Profile";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectSettings from "./pages/ProjectSettings";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import Tasks from "./pages/Tasks";
import Teams from "./pages/Teams";


const queryClient = new QueryClient();

// This // This function was duplicated and is now removed
// The App component is defined below
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
  <HelmetProvider>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create-company" element={<CreateCompany />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/package-selection" element={<PackageSelection />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/invite" element={<Invite />} />
              <Route path="/invite" element={<InviteMember />} />
              <Route path="/generate-invite-link" element={<GenerateInviteLink />} />
              <Route path="/accept-invite" element={<ValidateInvite />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/create-project" element={<CreateProject />} />
              <Route path="/projects" element={<Projects />} />
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
          <Footer />
        </div>
      </TooltipProvider>
    </AuthProvider>
  </HelmetProvider>
</QueryClientProvider>

  );
};

export default App;