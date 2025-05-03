"use client";
import { login } from "@/service/authService";
import React, { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Attempting login with:", { email, password });
      const response = await login({ email, password });
      console.log("Login response:", response.data);
      localStorage.setItem("token", response.data.token);
      setError("");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err?.response?.data?.message || "Login failed. Check your credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input className="border p-2 w-full" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input className="border p-2 w-full" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
