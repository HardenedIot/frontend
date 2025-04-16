"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSnackbar } from "@/hooks/useSnackbar"
import { fetchProjects } from "@/services/projectService"
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material"
import { Search as SearchIcon, Public as PublicIcon, Lock as LockIcon } from "@mui/icons-material"
import type { Project } from "@/types"
import Link from "next/link"

export default function Projects() {
  const { showSnackbar } = useSnackbar()
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [teamFilter, setTeamFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)
        const projectsData = await fetchProjects()
        setProjects(projectsData)
        setFilteredProjects(projectsData)

        const uniqueTeams = Array.from(new Set(projectsData.map((project) => project.team_id))).map((teamId) => {
          const project = projectsData.find((p) => p.team_id === teamId)
          return {
            id: teamId,
            name: project?.team?.team_name || "Unknown Team",
          }
        })

        setTeams(uniqueTeams)
      } catch (error) {
        showSnackbar("Failed to load projects", "error")
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [showSnackbar])

  useEffect(() => {
    let filtered = projects

    if (teamFilter !== "all") {
      filtered = filtered.filter((project) => project.team_id === teamFilter)
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (project) =>
          project.project_name.toLowerCase().includes(query) ||
          project.project_id.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query) ||
          project.team?.team_name.toLowerCase().includes(query),
      )
    }

    setFilteredProjects(filtered)
  }, [searchQuery, teamFilter, projects])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleTeamFilterChange = (e: SelectChangeEvent) => {
    setTeamFilter(e.target.value)
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" component="h1">
          Projects
        </Typography>
        <Link href="/projects/create" passHref>
          <Button variant="contained" color="primary">
            Create Project
          </Button>
        </Link>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="team-filter-label">Team</InputLabel>
          <Select labelId="team-filter-label" value={teamFilter} label="Team" onChange={handleTeamFilterChange}>
            <MenuItem value="all">All Teams</MenuItem>
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>
                {team.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {filteredProjects.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          No projects found. Try a different search or create a new project.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid key={project.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="h6" component="h2">
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
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {project.description || "No description"}
                  </Typography>
                  <Typography variant="caption" display="block">
                    Project ID: {project.project_id}
                  </Typography>
                  <Typography variant="caption" display="block">
                    Team: {project.team?.team_name || "Unknown Team"}
                  </Typography>
                  {project.url && (
                    <Typography variant="caption" display="block">
                      URL: {project.url}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Link href={`/projects/${project.project_id}`} passHref>
                    <Button size="small">View Tasks</Button>
                  </Link>
                  <Link href={`/projects/${project.project_id}/edit`} passHref>
                    <Button size="small">Edit</Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
