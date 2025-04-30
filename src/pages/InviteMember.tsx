import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const InviteMember = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!email.trim()) {
      toast.error("Please enter an email.");
      return;
    }

    if (!user?.companyId) {
      toast.error("You must be associated with a company first.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      await axios.post(
        "/api/invites",
        {
          email,
          companyId: user.companyId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Invitation sent successfully!");
      setEmail(""); // clear input
    } catch (error: any) {
      console.error("Invite failed:", error);
      toast.error(error?.response?.data?.message || "Failed to send invite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Invite a Team Member</h1>

      <Input
        placeholder="Teammate's Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4"
      />

      <Button onClick={handleInvite} disabled={loading}>
        {loading ? "Inviting..." : "Send Invite"}
      </Button>
    </div>
  );
};

export default InviteMember;
