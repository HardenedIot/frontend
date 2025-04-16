"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSnackbar } from "@/hooks/useSnackbar"
import { fetchTeam, deleteTeam } from "@/services/teamService"
import { fetchTeamProjects } from "@/services/projectService"
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material"
import {
  Public as PublicIcon,
  Lock as LockIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material"
import type { Team, Project, User } from "@/types"
import Link from "next/link"

export default function TeamDetails({ params }: { params: Promise<{ teamId: string }> }) {
  const [teamId, setTeamId] = useState<string | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params;
      setTeamId(resolvedParams.teamId);
    };

    loadParams();
  }, [params]);

  useEffect(() => {
    if (!teamId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [teamData, projectsData] = await Promise.all([fetchTeam(teamId), fetchTeamProjects(teamId)]);
        setTeam(teamData);
        setProjects(projectsData);
      } catch (error) {
        showSnackbar("Failed to load team details", "error");
        router.push("/teams");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [teamId, showSnackbar, router]);

  const handleDeleteTeam = async () => {
    try {
      setDeleteLoading(true);
      await deleteTeam(teamId!);
      showSnackbar("Team deleted successfully", "success");
      router.push("/teams");
    } catch (error) {
      showSnackbar("Failed to delete team", "error");
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!team) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", py: 4 }}>
        <Typography variant="h5" color="error">
          Team not found
        </Typography>
        <Button component={Link} href="/teams" sx={{ mt: 2 }}>
          Back to Teams
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h4" component="h1">
                {team.team_name}
              </Typography>
              <Chip
                icon={team.private ? <LockIcon /> : <PublicIcon />}
                label={team.private ? "Private" : "Public"}
                size="small"
                color={team.private ? "default" : "primary"}
              />
            </Box>
            <Typography variant="subtitle1" color="textSecondary" sx={{ mt: 1 }}>
              Team ID: {team.team_id}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Description: {team.description || "No description provided."}
            </Typography>
          </Box>
          <Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              component={Link}
              href={`/teams/${teamId}/edit`}
              sx={{ mr: 1 }}
            >
              Edit Team
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Team
            </Button>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        <Grid>
          <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" component="h2">
              Projects
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              component={Link}
              href={`/projects/create?teamId=${teamId}`}
            >
              New Project
            </Button>
          </Box>

          {projects.length === 0 ? (
            <Paper sx={{ p: 3 }}>
              <Typography variant="body1" color="textSecondary" align="center">
                No projects found for this team.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {projects.map((project) => (
                <Grid key={project.project_id}>
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
                      {project.private !== undefined && (
                        <Chip
                          icon={project.private ? <LockIcon /> : <PublicIcon />}
                          label={project.private ? "Private" : "Public"}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </CardContent>
                    <CardActions>
                      <Button size="small" component={Link} href={`/projects/${project.project_id}`}>
                        View Tasks
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        <Grid>
          <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
            Team Members
          </Typography>

          <Paper>
            {team.users && team.users.length > 0 ? (
              <List>
                {team.users.map((user: User) => (
                  <ListItem key={user.id}>
                    <ListItemAvatar>
                      <Avatar>
                        {user.name.charAt(0)}
                        {user.surname.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${user.name} ${user.surname}`}
                      secondary={`@${user.username} • ${user.email}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 3 }}>
                <Typography variant="body1" color="textSecondary" align="center">
                  No members in this team.
                </Typography>
              </Box>
            )}
          </Paper>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            fullWidth
            sx={{ mt: 2 }}
            component={Link}
            href={`/teams/${teamId}/invite`}
          >
            Invite Members
          </Button>
        </Grid>
      </Grid>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Team</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the team "{team.team_name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteTeam}
            color="error"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}