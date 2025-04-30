import { getProject, updateProject } from "@/lib/api/projects"; // ensure getProject exists
import { useEffect, useState } from "react";
import { useNavigate, useParams} from @/lib/api/projectsuter-dom";

export default function EditProject() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("IN_PROGRESS");

  // Load project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const project = await getProject(id!); // assumes ID is always present
        setName(project.name);
        setDescription(project.description);
        setStatus(project.status);
      } catch (err) {
        console.error("Failed to load project:", err);
      }
    };

    if (id) fetchProject();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await updateProject(id!, { name, description, status });
      navigate(`/projects/${id}`); // redirect to detail page
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>

      <input
        className="block w-full mb-2 border px-3 py-2 rounded"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        className="block w-full mb-2 border px-3 py-2 rounded"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        className="block w-full mb-4 border px-3 py-2 rounded"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
        <option value="ON_HOLD">On Hold</option>
      </select>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleUpdate}
      >
        Save Changes
      </button>
    </div>
  );
}
