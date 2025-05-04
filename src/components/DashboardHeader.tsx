import axios from "axios";
import React, { useEffect, useState } from "react";

const DashboardHeader: React.FC = () => {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/users/me");
        setUserName(res.data.name || "User");
      } catch (err) {
        console.error("Failed to load user", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">Welcome back, {userName}</h1>
      <p className="text-muted-foreground mt-1 text-sm">Here’s what’s happening in your workspace today.</p>
    </div>
  );
};

export default DashboardHeader;
