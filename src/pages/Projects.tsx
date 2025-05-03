import ProjectsList from "@/components/ProjectsList";
import { getProjects } from "@/service/project";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface Project {
  id: string;
  name: string;
  description: string;
  companyId: string;
  status: 'active' | 'completed' | 'on-hold';
  lastUpdated: string;
  teamSize: number;
  tags: string[];
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // loading state
  
  useEffect(() => {
    const companyId = localStorage.getItem('companyId') || '';
    
    setLoading(true); // Start loading
    getProjects(companyId)
      .then(response => {
        // Transform the data to match the Project interface
        const transformedProjects = response.data.map((project: any) => ({
          ...project,
          // Add default values for missing properties
          status: project.status || 'active',
          lastUpdated: project.lastUpdated || new Date().toISOString(),
          teamSize: project.teamSize || 1,
          tags: project.tags || [],
        }));
        setProjects(transformedProjects);
        setLoading(false); // End loading
      })
      .catch(() => {
        toast.error("Failed to load projects");
        setLoading(false); // End loading
      });
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

      {loading ? (
        <div className="text-center">Loading projects...</div> // Display loading message
      ) : (
        <ProjectsList projects={projects} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default ProjectsPage;
