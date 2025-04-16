"use client"

import { useContext } from "react"
import { SnackbarContext } from "@/contexts/SnackbarContext"

export const useSnackbar = () => {
  return useContext(SnackbarContext)
}
