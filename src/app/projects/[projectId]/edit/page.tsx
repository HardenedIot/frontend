"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSnackbar } from "@/hooks/useSnackbar";
import { fetchProject, updateProject } from "@/services/projectService";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  FormControlLabel,
  Switch,
} from "@mui/material";

export default function EditProject() {
  const { projectId } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState<{ project_name?: string }>({});
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  // Normalize projectId to string
  const normalizedProjectId = Array.isArray(projectId) ? projectId[0] : projectId;

  useEffect(() => {
    if (!normalizedProjectId) return;

    const loadData = async () => {
      try {
        const projectData = await fetchProject(normalizedProjectId);
        setProject(projectData);
      } catch (error) {
        showSnackbar("Failed to load project details", "error");
        router.push("/projects");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [normalizedProjectId, showSnackbar, router]);

  const validate = () => {
    const newErrors: { project_name?: string } = {};
    if (!project?.project_name || project.project_name.trim().length < 3) {
      newErrors.project_name = "Project name must be at least 3 characters long";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProject = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    setUpdating(true);
    try {
      await updateProject(normalizedProjectId!, project);
      showSnackbar("Project updated successfully", "success");
      router.push(`/projects/${normalizedProjectId}`);
    } catch (error) {
      showSnackbar("Failed to update project", "error");
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
        Edit Project
      </Typography>
      <form onSubmit={handleUpdateProject} noValidate>
        <TextField
          label="Project Name"
          value={project.project_name || ""}
          onChange={(e) => setProject({ ...project, project_name: e.target.value })}
          fullWidth
          required
          margin="normal"
          error={Boolean(errors.project_name)}
          helperText={errors.project_name}
        />
        <TextField
          label="Description"
          value={project.description || ""}
          onChange={(e) => setProject({ ...project, description: e.target.value })}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <TextField
          label="URL"
          value={project.url || ""}
          onChange={(e) => setProject({ ...project, url: e.target.value })}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={
            <Switch
              checked={project.private || false}
              onChange={(e) => setProject({ ...project, private: e.target.checked })}
              color="primary"
            />
          }
          label="Private Project"
        />
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" disabled={updating}>
            {updating ? <CircularProgress size={24} /> : "Update Project"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
