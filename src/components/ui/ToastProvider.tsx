"use client"

import type React from "react"
import { createContext, useContext, useState, useRef } from "react"
import Toast, { type ToastType } from "./Toast"

interface ToastOptions {
  type?: ToastType
  duration?: number
  action?: {
    label: string
    onPress: () => void
  }
}

interface ToastContextType {
  showToast: (message: string, options?: ToastOptions) => void
  hideToast: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

interface ToastProviderProps {
  children: React.ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState("")
  const [type, setType] = useState<ToastType>("info")
  const [duration, setDuration] = useState(3000)
  const [action, setAction] = useState<{ label: string; onPress: () => void } | undefined>(undefined)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const showToast = (message: string, options?: ToastOptions) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setMessage(message)
    setType(options?.type || "info")
    setDuration(options?.duration || 3000)
    setAction(options?.action)
    setVisible(true)

    // Auto-hide toast after duration
    if (options?.duration !== 0) {
      timeoutRef.current = setTimeout(() => {
        hideToast()
      }, options?.duration || 3000)
    }
  }

  const hideToast = () => {
    setVisible(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        visible={visible}
        message={message}
        type={type}
        duration={0} // We handle the duration ourselves
        onClose={hideToast}
        action={action}
      />
    </ToastContext.Provider>
  )
}
