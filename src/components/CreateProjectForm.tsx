"use client";
import { createProject } from "@/service/project";
import React, { useState } from "react";

export default function CreateProjectForm() {
  const [name, setName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      setStatus("You must be logged in to create a project");
      return;
    }
    
    try {
      await createProject({ name, companyId }, token);
      setStatus("Project created successfully");
      setName("");
      setCompanyId("");
    } catch (error) {
      console.error("Error creating project:", error);
      setStatus("Failed to create project");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input className="border p-2 w-full" value={name} onChange={(e) => setName(e.target.value)} placeholder="Project Name" required />
      <input className="border p-2 w-full" value={companyId} onChange={(e) => setCompanyId(e.target.value)} placeholder="Company ID" required />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create Project</button>
      {status && <p>{status}</p>}
    </form>
  );
}
