import jwt from "jsonwebtoken";

// Replace with your real secret key (should be in your environment variables!)
const JWT_SECRET = process.env.JWT_SECRET || "IT0FD0v0XGkvutF9mBkPH4OrnwyukgNrwRZfDzpIuFA=";

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // returns the payload (user info)
  } catch (error) {
    throw new Error("Invalid token");
  }
}