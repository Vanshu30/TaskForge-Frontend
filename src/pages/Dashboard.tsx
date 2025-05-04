import React from "react";
import { Link } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import DashboardSidebar from "../components/DashboardSidebar";
import ProjectList from "../components/ProjectList";
import StatsPanel from "../components/StatsPanel"; // Assuming this contains the stats like Completed, Updated, etc.
const Dashboard: React.FC = () => {
  return (
    <div className="flex h-full min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-white dark:bg-gray-900">
        <DashboardSidebar />
      </aside>

      {/* Main content */}
      <section className="flex-1 flex flex-col">
        <DashboardHeader />

        <div className="flex flex-col gap-6 px-6 py-4">
          {/* Welcome Message + Quick Actions */}
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Welcome back, Sample User</h2>
              <p className="text-muted-foreground mt-1">Here’s what’s happening in your workspace today.</p>
            </div>

            <div className="flex gap-4">
              <Link to="/invite" className="text-sm font-medium text-primary hover:underline">+ Invite</Link>
              <Link to="/create-project" className="text-sm font-medium text-primary hover:underline">+ New Project</Link>
            </div>
          </div>

          {/* Stats Panel */}
          <StatsPanel />
          <ProjectList />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
