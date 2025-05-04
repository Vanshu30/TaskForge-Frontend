import { FolderPlus, LayoutDashboard, LogOut, Users } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const DashboardSidebar: React.FC = () => {
  return (
    <div className="h-full flex flex-col justify-between p-4">
      {/* Logo */}
      <div>
        <h1 className="text-xl font-bold text-primary mb-6">TaskForge</h1>

        {/* Navigation */}
        <nav className="space-y-3">
          <Link to="/dashboard" className="flex items-center gap-3 text-sm hover:text-primary">
            <LayoutDashboard size={18} />
            <span>Projects</span>
          </Link>

          <Link to="/teams" className="flex items-center gap-3 text-sm hover:text-primary">
            <Users size={18} />
            <span>Teams</span>
          </Link>

          <Link to="/create-project" className="flex items-center gap-3 text-sm hover:text-primary">
            <FolderPlus size={18} />
            <span>Create Project</span>
          </Link>
        </nav>
      </div>

      {/* Logout */}
      <div>
        <button className="flex items-center gap-2 text-sm text-red-600 hover:underline">
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
