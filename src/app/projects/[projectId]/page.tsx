"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSnackbar } from "@/hooks/useSnackbar"
import { fetchProject, deleteProject } from "@/services/projectService"
import { fetchTasks, updateTask } from "@/services/taskService"
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material"
import {
  Public as PublicIcon,
  Lock as LockIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material"
import type { Project, Task, RiskLevel } from "@/types"
import Link from "next/link"

const riskLevelColors = {
  1: "success",
  2: "warning",
  3: "error",
}

const riskLevelLabels = {
  1: "Low",
  2: "Medium",
  3: "High",
}

export default function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [technologyFilter, setTechnologyFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const { showSnackbar } = useSnackbar()
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [projectData, tasksData] = await Promise.all([fetchProject(projectId), fetchTasks(projectId)])
        setProject(projectData)
        setTasks(tasksData)
        setFilteredTasks(tasksData)
      } catch (error) {
        showSnackbar("Failed to load project details", "error")
        router.push("/projects")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [projectId, showSnackbar, router])

  useEffect(() => {
    let filtered = tasks

    if (technologyFilter !== "all") {
      filtered = filtered.filter((task) => task.technology === technologyFilter)
    }

    if (statusFilter !== "all") {
      if (statusFilter === "completed") {
        filtered = filtered.filter((task) => task.completed)
      } else if (statusFilter === "ignored") {
        filtered = filtered.filter((task) => task.ignored)
      } else if (statusFilter === "pending") {
        filtered = filtered.filter((task) => !task.completed && !task.ignored)
      }
    }

    if (riskFilter !== "all") {
      filtered = filtered.filter((task) => task.risk_level === (Number.parseInt(riskFilter) as RiskLevel))
    }

    setFilteredTasks(filtered)
  }, [technologyFilter, statusFilter, riskFilter, tasks])

  const handleDeleteProject = async () => {
    try {
      setDeleteLoading(true)
      await deleteProject(projectId)
      showSnackbar("Project deleted successfully", "success")
      router.push("/projects")
    } catch (error) {
      showSnackbar("Failed to delete project", "error")
    } finally {
      setDeleteLoading(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleTaskStatusChange = async (taskId: string, status: "completed" | "ignored", value: boolean) => {
    try {
      const updatedTask = tasks.find((task) => task.task_id === taskId)
      if (!updatedTask) return

      const taskUpdate = {
        ...updatedTask,
        [status]: value,
      }

      if (status === "completed" && value) {
        taskUpdate.ignored = false
      }

      if (status === "ignored" && value) {
        taskUpdate.completed = false
      }

      await updateTask(projectId, taskUpdate)

      setTasks(tasks.map((task) => (task.task_id === taskId ? taskUpdate : task)))

      showSnackbar(`Task ${value ? status : "updated"}`, "success")
    } catch (error) {
      showSnackbar("Failed to update task", "error")
    }
  }

  const handleFilterChange = (filterType: "technology" | "status" | "risk", event: SelectChangeEvent) => {
    const value = event.target.value

    switch (filterType) {
      case "technology":
        setTechnologyFilter(value)
        break
      case "status":
        setStatusFilter(value)
        break
      case "risk":
        setRiskFilter(value)
        break
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!project) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", py: 4 }}>
        <Typography variant="h5" color="error">
          Project not found
        </Typography>
        <Button component={Link} href="/projects" sx={{ mt: 2 }}>
          Back to Projects
        </Button>
      </Box>
    )
  }

  const technologies = Array.from(new Set(tasks.map((task) => task.technology)))

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h4" component="h1">
                {project.project_name}
              </Typography>
              {project.private !== undefined && (
                <Chip
                  icon={project.private ? <LockIcon /> : <PublicIcon />}
                  label={project.private ? "Private" : "Public"}
                  size="small"
                  color={project.private ? "default" : "primary"}
                />
              )}
            </Box>
            <Typography variant="subtitle1" color="textSecondary" sx={{ mt: 1 }}>
              Project ID: {project.project_id}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Team: {project.team?.team_name || "Unknown Team"}
            </Typography>
            {project.url && (
              <Typography variant="subtitle1" color="textSecondary">
                URL:{" "}
                <Link href={project.url} target="_blank">
                  {project.url}
                </Link>
              </Typography>
            )}
          </Box>
          <Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              component={Link}
              href={`/projects/${projectId}/edit`}
              sx={{ mr: 1 }}
            >
              Edit Project
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Project
            </Button>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ mt: 3 }}>
          {project.description || "No description provided."}
        </Typography>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" component="h2">
            Tasks
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            href={`/projects/${projectId}/tasks/create`}
          >
            Add Task
          </Button>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <FilterIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1">Filters</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="technology-filter-label">Technology</InputLabel>
                <Select
                  labelId="technology-filter-label"
                  value={technologyFilter}
                  label="Technology"
                  onChange={(e) => handleFilterChange("technology", e)}
                >
                  <MenuItem value="all">All Technologies</MenuItem>
                  {technologies.map((tech) => (
                    <MenuItem key={tech} value={tech}>
                      {tech}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => handleFilterChange("status", e)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="ignored">Ignored</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="risk-filter-label">Risk Level</InputLabel>
                <Select
                  labelId="risk-filter-label"
                  value={riskFilter}
                  label="Risk Level"
                  onChange={(e) => handleFilterChange("risk", e)}
                >
                  <MenuItem value="all">All Risk Levels</MenuItem>
                  <MenuItem value="1">Low Risk</MenuItem>
                  <MenuItem value="2">Medium Risk</MenuItem>
                  <MenuItem value="3">High Risk</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {filteredTasks.length === 0 ? (
          <Paper sx={{ p: 3 }}>
            <Typography variant="body1" color="textSecondary" align="center">
              No tasks found for this project.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {filteredTasks.map((task) => (
              <Grid item key={task.task_id} xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {task.name}
                      </Typography>
                      <Chip
                        label={riskLevelLabels[task.risk_level]}
                        color={riskLevelColors[task.risk_level] as any}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      {task.description || "No description"}
                    </Typography>
                    <Chip label={task.technology} size="small" sx={{ mr: 1 }} />
                    {task.completed ? (
                      <Chip icon={<CheckCircleIcon />} label="Completed" color="success" size="small" sx={{ mr: 1 }} />
                    ) : task.ignored ? (
                      <Chip icon={<CancelIcon />} label="Ignored" color="default" size="small" sx={{ mr: 1 }} />
                    ) : (
                      <Chip icon={<WarningIcon />} label="Pending" color="warning" size="small" sx={{ mr: 1 }} />
                    )}
                  </CardContent>
                  <CardActions>
                    <Tooltip title="Mark as completed">
                      <IconButton
                        color={task.completed ? "success" : "default"}
                        onClick={() => handleTaskStatusChange(task.task_id, "completed", !task.completed)}
                        disabled={task.ignored}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Mark as ignored">
                      <IconButton
                        color={task.ignored ? "error" : "default"}
                        onClick={() => handleTaskStatusChange(task.task_id, "ignored", !task.ignored)}
                        disabled={task.completed}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                    <Link href={`/projects/${projectId}/tasks/${task.task_id}/edit`} passHref>
                      <Tooltip title="Edit task">
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </Link>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the project "{project.project_name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteProject}
            color="error"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}