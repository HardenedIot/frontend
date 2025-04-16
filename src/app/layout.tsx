"use client";

import type React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AuthProvider } from "@/contexts/AuthContext";
import { SnackbarProvider } from "@/contexts/SnackbarContext";
import theme from "@/theme/theme";
import Navigation from "@/components/Navigation";
import { Box } from "@mui/material";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider>
            <AuthProvider>
              <Box sx={{ display: "flex" }}>
                <Navigation />
                <Box component="main" sx={{ flexGrow: 1, p: 3, width: "100%" }}>
                  {children}
                </Box>
              </Box>
            </AuthProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}