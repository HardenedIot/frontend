import type { Team } from "@/types"

import { getAuthHeaders } from "./authService";

// const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
let backendUrl = "http://localhost:3002"

export const fetchTeams = async (): Promise<Team[]> => {
  const response = await fetch(`${backendUrl}/teams`, {
    method: "GET",
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch teams")
  }

  const data = await response.json()
  return data as Team[]
}


export const fetchUserTeams = async (): Promise<Team[]> => {

  const response = await fetch(`${backendUrl}/teams`, {
    method: "GET",
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch user teams")
  }

  const data = await response.json()
  return data as Team[]
}


export const fetchTeam = async (teamId: string): Promise<Team> => {
  const response = await fetch(`${backendUrl}/teams/${teamId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch team ${teamId}`)
  }

  const data = await response.json()
  return data as Team
}


export const createTeam = async (teamData: Partial<Team>): Promise<Team> => {
  const response = await fetch(`${backendUrl}/teams`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(teamData),
  })

  if (!response.ok) {
    throw new Error("Failed to create team")
  }

  const data = await response.json()
  return data as Team
}


export const updateTeam = async (teamId: string, teamData: Partial<Team>): Promise<Team> => {
  const response = await fetch(`${backendUrl}/teams/${teamId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(teamData),
  })

  if (!response.ok) {
    throw new Error(`Failed to update team ${teamId}`)
  }

  const data = await response.json()
  return data as Team
}


export const deleteTeam = async (teamId: string): Promise<void> => {
  const response = await fetch(`${backendUrl}/teams/${teamId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to delete team ${teamId}`)
  }
}
