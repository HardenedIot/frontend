import type { User } from "../types";

const TOKEN_KEY = "auth_token";
const USER_KEY = "current_user";

let backendUrl = "http://localhost:3002";

export const login = async (email: string, password: string): Promise<User> => {
  const response = await fetch(`${backendUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();

  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));

  return data.user;
};

export const register = async (userData: Omit<User, "id" | "teams"> & { password: string }): Promise<void> => {
  const response = await fetch(`${backendUrl}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }
};

export const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getCurrentUser = async (): Promise<User> => {
  const token = localStorage.getItem(TOKEN_KEY);
  const currentUser = localStorage.getItem(USER_KEY);

  if (!token || !currentUser) {
    throw new Error("Not authenticated");
  }

  const user = JSON.parse(currentUser);
  const username = user.username;

  const response = await fetch(`${backendUrl}/users/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  const fetchedUser = await response.json();
  return fetchedUser;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(TOKEN_KEY);
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  } else {
    return {
      "Content-Type": "application/json",
    };
  }
};