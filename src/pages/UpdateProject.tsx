import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateProject = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // get project ID from URL

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setName(res.data.name);
        setDescription(res.data.description);
      } catch (error: any) {
        console.error("Failed to fetch project:", error);
        toast.error(error?.response?.data?.message || "Failed to load project.");
      }
    };

    fetchProject();
  }, [id]);

  const handleUpdateProject = async () => {
    if (!name.trim()) {
      toast.error("Project name is required!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `/api/projects/${id}`,
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Project updated successfully! 🎉");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Project update failed:", error);
      toast.error(error?.response?.data?.message || "Failed to update project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Update Project</h1>

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

      <Button onClick={handleUpdateProject} disabled={loading}>
        {loading ? "Updating..." : "Update Project"}
      </Button>
    </div>
  );
};

export default UpdateProject;
