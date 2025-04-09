"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { themeVariants } from "../design/designSystem"
import { useColorScheme } from "react-native"

export type ThemeType = "default" | "dark" | "uzzap" | "ocean" | "rose" | "emerald" | "amber"

interface ThemeContextType {
  theme: ThemeType
  colors: typeof themeVariants.default
  isDark: boolean
  changeTheme: (newTheme: ThemeType) => void
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme()
  const [theme, setTheme] = useState<ThemeType>("default")
  const [isDark, setIsDark] = useState<boolean>(systemColorScheme === "dark")

  useEffect(() => {
    // Load saved theme from storage
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("userTheme")
        const savedDarkMode = await AsyncStorage.getItem("darkMode")

        if (savedTheme && Object.keys(themeVariants).includes(savedTheme)) {
          setTheme(savedTheme as ThemeType)
        }

        if (savedDarkMode !== null) {
          setIsDark(savedDarkMode === "true")
        } else {
          // Use system preference if no saved preference
          setIsDark(systemColorScheme === "dark")
        }
      } catch (error) {
        console.error("Failed to load theme:", error)
      }
    }

    loadTheme()
  }, [systemColorScheme])

  const changeTheme = async (newTheme: ThemeType) => {
    setTheme(newTheme)
    try {
      await AsyncStorage.setItem("userTheme", newTheme)
    } catch (error) {
      console.error("Failed to save theme:", error)
    }
  }

  const toggleDarkMode = async () => {
    const newDarkMode = !isDark
    setIsDark(newDarkMode)
    try {
      await AsyncStorage.setItem("darkMode", newDarkMode.toString())
    } catch (error) {
      console.error("Failed to save dark mode setting:", error)
    }
  }

  // Get the base theme (light or dark)
  const baseTheme = isDark ? themeVariants.dark : themeVariants[theme]

  // Apply dark mode to themed variants if needed
  const currentColors =
    isDark && theme !== "dark"
      ? { ...baseTheme, background: themeVariants.dark.background, surface: themeVariants.dark.surface }
      : baseTheme

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors: currentColors,
        isDark,
        changeTheme,
        toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
