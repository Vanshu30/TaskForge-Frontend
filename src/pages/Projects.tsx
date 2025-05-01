import ProjectsList from "@/components/ProjectsList";
import { getProjects } from "@/service/project"; // your service layer
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// Define the Project interface
interface Project {
  id: string;
  name: string;
  description: string;
  companyId: string;
  // Add other properties as needed
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  
  useEffect(() => {
    // Assuming we have the companyId from context or localStorage
    const companyId = localStorage.getItem('companyId') || '';
    
    getProjects(companyId)
      .then(response => setProjects(response.data))
      .catch(() => toast.error("Failed to load projects"));
  }, []);

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Projects</h1>
        <Link to="/projects/new" className="text-blue-600 underline">
          + New Project
        </Link>
      </div>
      <ProjectsList projects={projects} onDelete={handleDelete} />
    </div>
  );
};

export default ProjectsPage;
