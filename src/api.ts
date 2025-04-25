const API_BASE_URL= import.meta.env.VITE_API_BASE_URL;

// Login
export async function loginUser(credentials: { 
  email: string, 
  password: string,
  organizationId?: string,
  organizationName?: string,
  role?: string
}) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return response.json();
}

// Signup
export async function signupUser(details: { 
  
  name: string, 
  
  email: string, 
  
  password: string,
  organizationId?: string,
  organizationName?: string,
  role: string
}) {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details)
  });
  return response.json();
}

// Fetch Projects
export async function getProjects() {
  const response = await fetch(`${API_BASE_URL}/projects`);
  if (!response.ok) throw new Error("Failed to fetch projects");
  return response.json();
}

// Fetch Tasks
export async function getTasks() {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  return response.json();
}
