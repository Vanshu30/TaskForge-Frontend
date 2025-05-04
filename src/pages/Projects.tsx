import ProjectsList from "@/components/ProjectsList";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  lastUpdated: string;
  teamSize: number;
  tags: string[];
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // loading state
  
  useEffect(() => {
    setLoading(true); // Start loading
    
    try {
      // Load projects from localStorage
      const savedProjects = localStorage.getItem('projects');
      if (savedProjects) {
        const parsedProjects = JSON.parse(savedProjects);
        setProjects(parsedProjects);
      } else {
        // If no projects in localStorage, set empty array
        setProjects([]);
      }
    } catch (error) {
      console.error('Failed to parse saved projects:', error);
      toast.error("Failed to load projects");
      setProjects([]);
    } finally {
      setLoading(false); // End loading
    }
  }, []);

  const handleDelete = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    
    // Update localStorage
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    toast.success("Project deleted successfully");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Projects</h1>
        <Link to="/create-project" className="text-blue-600 underline">
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
