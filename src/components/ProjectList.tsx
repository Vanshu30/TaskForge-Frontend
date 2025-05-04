// components/ProjectList.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectsList from './ProjectsList';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  lastUpdated: string;
  teamSize: number;
  tags: string[];
}

const ProjectList: React.FC = () => {
  // Initialize with an empty array - no sample projects
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // In a real application, you would fetch projects from an API here
    // For now, we'll just use an empty array to start with
    
    // Example of how to fetch projects from an API:
    /*
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    fetchProjects();
    */
    
    // Retrieve projects from localStorage if you're storing them there
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        setProjects(parsedProjects);
      } catch (error) {
        console.error('Failed to parse saved projects:', error);
      }
    }
  }, []);

  const handleDeleteProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    // If you're using localStorage to persist projects, update it
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Your Projects</h3>
        <Link to="/projects" className="text-sm font-medium text-primary hover:underline">
          View All
        </Link>
      </div>
      {projects.length > 0 ? (
        <ProjectsList projects={projects} onDelete={handleDeleteProject} />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No projects found. Create your first project!
        </div>
      )}
    </div>
  );
};

export default ProjectList;