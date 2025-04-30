import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

    if (!user?.companyId) {
      toast.error("You must belong to a company first.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "/api/projects",
        { name, description, companyId: user.companyId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Project created successfully! 🎉");
      navigate("/dashboard"); // Redirect back to dashboard or projects list
    } catch (error: any) {
      console.error("Project creation failed:", error);
      toast.error(error?.response?.data?.message || "Failed to create project.");
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
        {loading ? "Creating..." : "Create Project"
        }
      </Button>
    </div>
  );
};

export default CreateProject;
