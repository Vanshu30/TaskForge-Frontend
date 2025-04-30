import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const ValidateInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const inviteToken = searchParams.get("token");

  useEffect(() => {
    if (!inviteToken) {
      toast.error("Invalid or missing invite token.");
      navigate("/login");
    }
  }, [inviteToken, navigate]);

  const handleAcceptInvite = async () => {
    if (!email.trim() || !password.trim() || !name.trim()) {
      toast.error("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/invites/accept", {
        token: inviteToken,
        email,
        name,
        password,
      });

      toast.success("Invite accepted! You can now log in.");
      navigate("/login");
    } catch (error: any) {
      console.error("Accept invite failed:", error);
      toast.error(error?.response?.data?.message || "Failed to accept invite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Accept Invitation</h1>

      <Input
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4"
      />

      <Input
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4"
      />

      <Input
        type="password"
        placeholder="Set Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4"
      />

      <Button onClick={handleAcceptInvite} disabled={loading}>
        {loading ? "Accepting..." : "Accept Invite"}
      </Button>
    </div>
  );
};

export default ValidateInvite;
