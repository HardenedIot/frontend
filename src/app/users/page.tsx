"use client";

import { useEffect, useState } from "react";
import { useSnackbar } from "@/hooks/useSnackbar";
import { fetchUsers } from "@/services/userService";
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { User } from "@/types";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const userData = await fetchUsers();
        setUsers(userData);
      } catch (error) {
        showSnackbar("Failed to load users", "error");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [showSnackbar]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Registered Users
      </Typography>
      <Paper sx={{ p: 2 }}>
        {users.length === 0 ? (
          <Typography variant="body1" color="textSecondary" align="center">
            No users found.
          </Typography>
        ) : (
          <List>
            {users.map((user) => (
              <ListItem key={user.id}>
                <ListItemText
                  primary={`${user.name} ${user.surname}`}
                  secondary={`@${user.username} • ${user.email}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
