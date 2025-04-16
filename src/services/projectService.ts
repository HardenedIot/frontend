import type { Project } from "../types";

import { getAuthHeaders } from "./authService";

// const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
let backendUrl = "http://localhost:3002"

export const fetchProjects = async (): Promise<Project[]> => {
  const response = await fetch(`${backendUrl}/projects`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  const projects = await response.json();
  return projects;
};


export const fetchUserProjects = async (): Promise<Project[]> => {
  return fetchProjects();
};

export const fetchTeamProjects = async (teamId: string): Promise<Project[]> => {
  const response = await fetch(`${backendUrl}/teams/${teamId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch team projects");
  }

  const projects = await response.json();
  return projects;
};


export const fetchProject = async (projectId: string): Promise<Project> => {
  const response = await fetch(`${backendUrl}/projects/${projectId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Project not found");
  }

  const project = await response.json();
  return project;
};


export const createProject = async (projectData: Partial<Project>): Promise<Project> => {
  const response = await fetch(`${backendUrl}/projects`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  const project = await response.json();
  return project;
};


export const updateProject = async (projectId: string, projectData: Partial<Project>): Promise<Project> => {
  const response = await fetch(`${backendUrl}/projects/${projectId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    throw new Error("Failed to update project");
  }

  const project = await response.json();
  return project;
};


export const deleteProject = async (projectId: string): Promise<void> => {
  const response = await fetch(`${backendUrl}/projects/${projectId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete project");
  }
};
