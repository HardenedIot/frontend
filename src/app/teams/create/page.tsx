"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSnackbar } from "@/hooks/useSnackbar"
import { createTeam } from "@/services/teamService"
import { Box, Typography, Paper, TextField, Button, FormControlLabel, Switch, CircularProgress } from "@mui/material"
import Link from "next/link"

export default function CreateTeam() {
  const [formData, setFormData] = useState({
    team_name: "",
    team_id: "",
    description: "",
    private: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const { showSnackbar } = useSnackbar()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.team_name) {
      newErrors.team_name = "Team name is required"
    } else if (formData.team_name.length < 3 || formData.team_name.length > 50) {
      newErrors.team_name = "Team name must be between 3 and 50 characters"
    }

    if (!formData.team_id) {
      newErrors.team_id = "Team ID is required"
    } else if (formData.team_id.length < 1 || formData.team_id.length > 50) {
      newErrors.team_id = "Team ID must be between 1 and 50 characters"
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    try {
      setLoading(true)
      await createTeam(formData)
      showSnackbar("Team created successfully!", "success")
      router.push("/dashboard")
    } catch (error) {
      showSnackbar("Failed to create team. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Team
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            required
            label="Team Name"
            name="team_name"
            value={formData.team_name}
            onChange={handleChange}
            error={!!errors.team_name}
            helperText={errors.team_name}
            margin="normal"
          />

          <TextField
            fullWidth
            required
            label="Team ID"
            name="team_id"
            value={formData.team_id}
            onChange={handleChange}
            error={!!errors.team_id}
            helperText={errors.team_id}
            margin="normal"
          />

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

          <FormControlLabel
            control={<Switch checked={formData.private} onChange={handleChange} name="private" color="primary" />}
            label="Make team private"
            sx={{ mt: 2 }}
          />

          <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
            <Link href="/teams" passHref>
              <Button variant="outlined">Cancel</Button>
            </Link>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Creating..." : "Create Team"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}