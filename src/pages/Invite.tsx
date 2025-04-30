import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Invite = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleInvite = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "/api/invite",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Invitation sent!");
      navigate("/"); // Go back to dashboard after sending invite
    } catch (error) {
      console.error("Failed to send invite:", error);
      alert("Failed to send invite.");
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Invite Teammate</h1>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter teammate's email"
          />
        </div>
        <Button onClick={handleInvite}>Send Invite</Button>
      </div>
    </div>
  );
};

export default Invite;
