"use client"

import * as React from "react"
import { toast as sonner } from "sonner"

export type ToastVariant = "default" | "destructive"
export interface Toast {
  id?: string
  title?: string
  description?: string
  variant?: ToastVariant
  action?: ToastAction
}

export interface ToastAction {
  label: string
  onClick: () => void
}

export const useToast = () => {
  return {
    toast: (toast: Toast) => sonner
  }
}