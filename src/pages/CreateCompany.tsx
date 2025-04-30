import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateCompany = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateCompany = async () => {
    if (!name.trim()) {
      toast.error("Company name is required!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        "/api/companies",
        { name, description, website },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Company created successfully! 🎉");
      console.log("Created company:", response.data);

      // You can optionally save company data in context or localStorage
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error: any) {
      console.error("Company creation failed:", error);
      toast.error(error?.response?.data?.message || "Failed to create company.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Create Company</h1>

      <Input
        placeholder="Company Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4"
      />

      <Textarea
        placeholder="Company Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4"
      />

      <Input
        placeholder="Company Website (optional)"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="mb-4"
      />

      <Button onClick={handleCreateCompany} disabled={loading}>
        {loading ? "Creating..." : "Create Company"}
      </Button>
    </div>
  );
};

export default CreateCompany;
