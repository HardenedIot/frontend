import type { User } from "../types";
const TOKEN_KEY = "auth_token";

const backendUrl = "http://localhost:3002";

export const fetchUsers = async (): Promise<User[]> => {
    const token = localStorage.getItem(TOKEN_KEY);
  
    if (!token) {
      throw new Error("Not authenticated");
    }
  
    const response = await fetch(`${backendUrl}/users`, {
        headers: {
            Authorization: `Bearer ${token}`,
          },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }
    return response.json();
};
