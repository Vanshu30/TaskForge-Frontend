import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GenerateInviteLink = () => {
  const navigate = useNavigate();
  const [inviteLink, setInviteLink] = useState("");

  const handleGenerateLink = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "/api/generate-invite-link",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInviteLink(response.data.inviteLink);
    } catch (error) {
      console.error("Failed to generate invite link:", error);
      alert("Failed to generate invite link.");
    }
  };

  const handleCopy = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      alert("Invite link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Generate Invite Link</h1>
      <div className="space-y-6">
        <Button onClick={handleGenerateLink}>Generate Link</Button>
        
        {inviteLink && (
          <div className="space-y-4">
            <Input value={inviteLink} readOnly />
            <Button variant="outline" onClick={handleCopy}>
              Copy Link
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateInviteLink;
