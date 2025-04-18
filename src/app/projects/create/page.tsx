"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSnackbar } from "@/hooks/useSnackbar"
import { fetchTeams } from "@/services/teamService"
import { createProject } from "@/services/projectService"
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Checkbox,
  FormGroup
} from "@mui/material"
import type { Team } from "@/types"
import Link from "next/link"

const availableTechnologies = [
  "wifi", "uart", "jtag", "bluetooth", "lte", "rfid", "nfc",
  "ant+", "lifi", "zigbee", "z-wave", "lte-advanced", "lora",
  "nb-iot", "sigfox", "nb-fi", "http", "https", "coap",
  "mqtt", "amqp", "xmpp"
];

export default function CreateProject() {
  const [formData, setFormData] = useState({
    project_id: "",
    project_name: "",
    team_id: "",
    description: "",
    url: "",
    private: false,
    technologies: []
  })
  const [teams, setTeams] = useState<Team[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [teamsLoading, setTeamsLoading] = useState(true)
  const { showSnackbar } = useSnackbar()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setTeamsLoading(true)
        const teamsData = await fetchTeams()
        setTeams(teamsData)

        const teamIdParam = searchParams.get("teamId")
        if (teamIdParam) {
          setFormData((prev) => ({ ...prev, team_id: teamIdParam }))
        }
      } catch (error) {
        showSnackbar("Failed to load teams", "error")
      } finally {
        setTeamsLoading(false)
      }
    }

    loadTeams()
  }, [showSnackbar, searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value, checked, type } = e.target as HTMLInputElement
    setFormData({
      ...formData,
      [name as string]: type === "checkbox" ? checked : value,
    })
  }

  const handleTechnologyChange = (event) => {
    const { value, checked } = event.target;
    setFormData((prev) => {
      const technologies = checked
        ? [...prev.technologies, value]
        : prev.technologies.filter((tech) => tech !== value);
      return { ...prev, technologies };
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.project_name) {
      newErrors.project_name = "Project name is required"
    } else if (formData.project_name.length < 3 || formData.project_name.length > 50) {
      newErrors.project_name = "Project name must be between 3 and 50 characters"
    }

    if (!formData.team_id) {
      newErrors.team_id = "Team is required"
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    try {
      setLoading(true)
      await createProject(formData)
      showSnackbar("Project created successfully!", "success")
      router.push("/projects")
    } catch (error) {
      showSnackbar("Failed to create project. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Project
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>



          <TextField
            fullWidth
            required
            label="Project Name"
            name="project_name"
            value={formData.project_name}
            onChange={handleChange}
            error={!!errors.project_name}
            helperText={errors.project_name}
            margin="normal"
          />

          <TextField
            fullWidth
            required
            label="Project ID"
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
            error={!!errors.project_id}
            helperText={errors.project_id}
            margin="normal"
          />

          <FormControl fullWidth margin="normal" error={!!errors.team_id}>
            <InputLabel id="team-select-label">Team</InputLabel>
            <Select
              labelId="team-select-label"
              id="team-select"
              name="team_id"
              value={formData.team_id}
              label="Team"
              onChange={handleChange}
              disabled={teamsLoading}
            >
              {teamsLoading ? (
                <MenuItem value="">
                  <CircularProgress size={20} /> Loading teams...
                </MenuItem>
              ) : (
                teams.map((team) => (
                  <MenuItem key={team.id} value={team.team_id}>
                    {team.team_name}
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.team_id && (
              <Typography variant="caption" color="error">
                {errors.team_id}
              </Typography>
            )}
          </FormControl>

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            margin="normal"
            multiline
            rows={3}
          />

          <TextField
            fullWidth
            label="URL (optional)"
            name="url"
            value={formData.url}
            onChange={handleChange}
            margin="normal"
          />

          <FormControlLabel
            control={<Switch checked={formData.private} onChange={handleChange} name="private" color="primary" />}
            label="Make project private"
            sx={{ mt: 2 }}
          />

          <Typography variant="h6" component="h2" gutterBottom>
            Select Technologies
          </Typography>
          <FormGroup>
            {availableTechnologies.map((tech) => (
              <FormControlLabel
                key={tech}
                control={
                  <Checkbox
                    checked={formData.technologies.includes(tech)}
                    onChange={handleTechnologyChange}
                    value={tech}
                  />
                }
                label={tech}
              />
            ))}
          </FormGroup>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
            <Link href="/projects" passHref>
              <Button variant="outlined">Cancel</Button>
            </Link>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
