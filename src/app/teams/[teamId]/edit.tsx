"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "../../hooks/useSnackbar";
import { fetchTeam, updateTeam } from "../../services/teamService";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

export default function EditTeam({ params }: { params: Promise<{ teamId: string }> }) {
  const [teamId, setTeamId] = useState<string | null>(null);
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
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
        const teamData = await fetchTeam(teamId);
        setTeam(teamData);
      } catch (error) {
        showSnackbar("Failed to load team details", "error");
        router.push("/teams");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [teamId, showSnackbar, router]);

  const handleUpdateTeam = async (event: React.FormEvent) => {
    event.preventDefault();
    setUpdating(true);
    try {
      await updateTeam(teamId!, team);
      showSnackbar("Team updated successfully", "success");
      router.push(`/teams/${teamId}`);
    } catch (error) {
      showSnackbar("Failed to update team", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Team
      </Typography>
      <form onSubmit={handleUpdateTeam}>
        <TextField
          label="Team Name"
          value={team.team_name || ""}
          onChange={(e) => setTeam({ ...team, team_name: e.target.value })}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Description"
          value={team.description || ""}
          onChange={(e) => setTeam({ ...team, description: e.target.value })}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" disabled={updating}>
          {updating ? <CircularProgress size={24} /> : "Update Team"}
        </Button>
      </form>
    </Box>
  );
}
