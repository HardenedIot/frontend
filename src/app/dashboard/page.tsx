"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useSnackbar } from "@/hooks/useSnackbar"
import { fetchUserTeams } from "@/services/teamService"
import { fetchUserProjects } from "@/services/projectService"
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Divider, CircularProgress } from "@mui/material"
import type { Team, Project } from "@/types"
import Link from "next/link"

export default function Dashboard() {
  const { user } = useAuth()
  const { showSnackbar } = useSnackbar()
  const [teams, setTeams] = useState<Team[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [teamsData, projectsData] = await Promise.all([fetchUserTeams(), fetchUserProjects()])
        setTeams(teamsData)
        setProjects(projectsData)
      } catch (error) {
        showSnackbar("Failed to load dashboard data", "error")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [showSnackbar])

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user?.name}!
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" component="h2">
            Your Teams
          </Typography>
          <Link href="/teams/create" passHref>
            <Button variant="contained" color="primary">
              Create Team
            </Button>
          </Link>
        </Box>

        {teams.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="body1" color="textSecondary" align="center">
                You don't have any teams yet. Create a team to get started.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {teams.map((team) => (
              <Grid key={team.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {team.team_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      {team.description || "No description"}
                    </Typography>
                    <Typography variant="caption" display="block">
                      Team ID: {team.team_id}
                    </Typography>
                    <Typography variant="caption" display="block">
                      {team.private ? "Private Team" : "Public Team"}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Link href={`/teams/${team.team_id}`} passHref>
                      <Button size="small">View Details</Button>
                    </Link>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" component="h2">
            Recent Projects
          </Typography>
          <Link href="/projects/create" passHref>
            <Button variant="contained" color="primary">
              Create Project
            </Button>
          </Link>
        </Box>

        {projects.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="body1" color="textSecondary" align="center">
                You don't have any projects yet. Create a project to get started.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid key={project.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {project.project_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      {project.description || "No description"}
                    </Typography>
                    <Typography variant="caption" display="block">
                      Project ID: {project.project_id}
                    </Typography>
                    <Typography variant="caption" display="block">
                      Team: {project.team?.team_name || "Unknown Team"}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Link href={`/projects/${project.project_id}`} passHref>
                      <Button size="small">View Tasks</Button>
                    </Link>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  )
}
