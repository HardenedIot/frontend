import type { Task } from "@/types"

import { getAuthHeaders } from "./authService";

// const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
let backendUrl = "http://localhost:3002"

export const fetchTasks = async (projectId: string): Promise<Task[]> => {
  const response = await fetch(`${backendUrl}/project/${projectId}/tasks`, {
    method: "GET",
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks for project ${projectId}`)
  }

  const data = await response.json()
  return data as Task[]
}


export const createTask = async (projectId: string, taskData: Omit<Task, "task_id">): Promise<Task> => {
  const response = await fetch(`${backendUrl}/project/${projectId}/tasks`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  })

  if (!response.ok) {
    throw new Error(`Failed to create task for project ${projectId}`)
  }

  const data = await response.json()
  return data as Task
}


export const updateTask = async (projectId: string, taskData: Task): Promise<Task> => {
  const response = await fetch(`${backendUrl}/project/${projectId}/tasks`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  })

  if (!response.ok) {
    throw new Error(`Failed to update task ${taskData.task_id} for project ${projectId}`)
  }

  const data = await response.json()
  return data as Task
}


export const deleteTask = async (projectId: string, taskId: string): Promise<void> => {
  const response = await fetch(`${backendUrl}/project/${projectId}/tasks`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    body: JSON.stringify({ task_id: taskId }),
  })

  if (!response.ok) {
    throw new Error(`Failed to delete task ${taskId} for project ${projectId}`)
  }
}
