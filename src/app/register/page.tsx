"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useSnackbar } from "@/hooks/useSnackbar"
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Link as MuiLink,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@mui/material"
import Link from "next/link"

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    private: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { register, loading } = useAuth()
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

    if (!formData.username) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3 || formData.username.length > 20) {
      newErrors.username = "Username must be between 3 and 20 characters"
    }

    if (!formData.name) {
      newErrors.name = "Name is required"
    } else if (formData.name.length < 1 || formData.name.length > 50) {
      newErrors.name = "Name must be between 1 and 50 characters"
    }

    if (!formData.surname) {
      newErrors.surname = "Surname is required"
    } else if (formData.surname.length < 1 || formData.surname.length > 50) {
      newErrors.surname = "Surname must be between 1 and 50 characters"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    try {
      await register({
        username: formData.username,
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        password: formData.password,
        private: formData.private,
      })
      showSnackbar("Registration successful! Please sign in.", "success")
      router.push("/login")
    } catch (error) {
      showSnackbar("Registration failed. Please try again.", "error")
    }
  }

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: "100%" }}>
          <Grid container spacing={2}>
            <Grid>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
              />
            </Grid>
            <Grid>
              <TextField
                required
                fullWidth
                id="name"
                label="First Name"
                name="name"
                autoComplete="given-name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid>
              <TextField
                required
                fullWidth
                id="surname"
                label="Last Name"
                name="surname"
                autoComplete="family-name"
                value={formData.surname}
                onChange={handleChange}
                error={!!errors.surname}
                helperText={errors.surname}
              />
            </Grid>
            <Grid>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
            <Grid>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
            </Grid>
            <Grid>
              <FormControlLabel
                control={<Checkbox name="private" checked={formData.private} onChange={handleChange} color="primary" />}
                label="Make my profile private"
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
          <Box sx={{ textAlign: "center" }}>
            <MuiLink href="/login" variant="body2">
              Already have an account? Sign in
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
