import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Define Project type
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  lastUpdated: string;
  teamSize: number;
  tags: string[];
}

const CreateProject = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateProject = async () => {
    if (!name.trim()) {
      toast.error("Project name is required!");
      return;
    }

    try {
      setLoading(true);
      
      // Create a new project object
      const newProject: Project = {
        id: `project-${Date.now()}`,
        name,
        description,
        status: 'active',
        lastUpdated: new Date().toISOString(),
        teamSize: 1,
        tags: [],
      };

      // In a real app, you would send this to an API
      // For now, we'll store it in localStorage
      const existingProjects = localStorage.getItem('projects');
      let projects: Project[] = [];
      
      if (existingProjects) {
        try {
          projects = JSON.parse(existingProjects) as Project[];
        } catch (e) {
          console.error('Error parsing projects from localStorage:', e);
        }
      }
      
      projects.push(newProject);
      localStorage.setItem('projects', JSON.stringify(projects));

      toast.success("Project created successfully! 🎉");
      navigate("/dashboard"); // Redirect back to dashboard
    } catch (error: any) {
      console.error("Project creation failed:", error);
      toast.error("Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Create a New Project</h1>

      <Input
        placeholder="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4"
      />

      <Input
        placeholder="Project Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4"
      />

      <Button onClick={handleCreateProject} disabled={loading}>
        {loading ? "Creating..." : "Create Project"}
      </Button>
    </div>
  );
};

export default CreateProject;
