import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Define the Project interface
interface Project {
  id: string;
  name: string;
  description: string;
  status?: 'active' | 'completed' | 'on-hold';
  lastUpdated?: string;
  teamSize?: number;
  tags?: string[];
}

interface ProjectsListProps {
  projects: Project[];
  onDelete: (id: string) => void; // handle UI after delete
}

const ProjectsList: React.FC<ProjectsListProps> = ({ projects, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Deleted!");
      onDelete(id); // remove from UI
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete.");
    }
  };

  return (
    <div className="grid gap-4">
      {projects.map((project) => (
        <div key={project.id} className="border p-4 rounded">
          <h3 className="text-lg font-bold">{project.name}</h3>
          <p>{project.description}</p>

          <div className="flex gap-2 mt-2">
            <Button onClick={() => navigate(`/project/${project.id}`)}>View</Button>
            <Button variant="destructive" onClick={() => handleDelete(project.id)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsList;