"use client";
import { signup } from "@/service/authService";
import React, { useState } from "react";

interface RegisterFormProps {
  onSubmit?: (data: { email: string; password: string; confirmPassword: string }) => void;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps = {}) {
  const [form, setForm] = useState({ 
    email: "", 
    password: "", 
    confirmPassword: "",
    name: "" 
  });
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSubmit) {
      // If onSubmit prop is provided, use it
      onSubmit({
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword
      });
    } else {
      try {
        await signup({
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword
        });
        setStatus("Registered successfully!");
      } catch {
        setStatus("Registration failed.");
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input 
        className="border p-2 w-full" 
        name="email" 
        value={form.email} 
        onChange={handleChange} 
        placeholder="Email" 
      />
      <input 
        className="border p-2 w-full" 
        type="password" 
        name="password" 
        value={form.password} 
        onChange={handleChange} 
        placeholder="Password" 
      />
      <input 
        className="border p-2 w-full" 
        type="password" 
        name="confirmPassword" 
        value={form.confirmPassword} 
        onChange={handleChange} 
        placeholder="Confirm Password" 
      />
      {!onSubmit && (
        <input 
          className="border p-2 w-full" 
          name="name" 
          value={form.name} 
          onChange={handleChange} 
          placeholder="Name" 
        />
      )}
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Sign Up
      </button>
      {status && <p className="mt-2">{status}</p>}
    </form>
  );
}
