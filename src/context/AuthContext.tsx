"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "../utils/supabaseClient"
import type { User } from "../models/types"
import { Alert } from "react-native"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, phoneNumber: string, password: string, email: string) => Promise<void>
  logout: () => Promise<void>
  updateStatus: (status: "online" | "away" | "offline") => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkLoginStatus = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Failed to get session:", error)
          setIsLoading(false)
          return
        }

        if (session?.user) {
          // Get user profile data
          const { data: userData, error: profileError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single()

          if (profileError) {
            console.error("Failed to get user profile:", profileError)
            setIsLoading(false)
            return
          }

          setUser({
            id: session.user.id,
            username: userData.username,
            phoneNumber: userData.phone_number,
            status: userData.status || "offline",
            lastSeen: userData.last_seen ? new Date(userData.last_seen).getTime() : undefined,
          })
        }
      } catch (error) {
        console.error("Failed to get user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkLoginStatus()

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Get user profile after sign in
        const { data: userData, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (!profileError && userData) {
          setUser({
            id: session.user.id,
            username: userData.username,
            phoneNumber: userData.phone_number,
            status: userData.status || "offline",
            lastSeen: userData.last_seen ? new Date(userData.last_seen).getTime() : undefined,
          })
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Update the register function to include email parameter and properly handle user creation
  const register = async (username: string, phoneNumber: string, password: string, email: string) => {
    setIsLoading(true)
    try {
      // Check if username already exists
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("username")
        .eq("username", username)
        .single()

      if (existingUser) {
        throw new Error("Username already exists")
      }

      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email, // Use email for auth
        password,
      })

      if (error) throw error

      if (data.user) {
        // Create user profile in the users table
        const { error: profileError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            username,
            phone_number: phoneNumber,
            status: "online",
            last_seen: new Date().toISOString(),
          },
        ])

        if (profileError) throw profileError

        // Create default settings for the user
        await supabase.from("user_settings").insert([{ user_id: data.user.id }])
      }
    } catch (error) {
      console.error("Registration failed:", error)
      throw new Error(error instanceof Error ? error.message : "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Update the login function to handle email instead of username
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Update user status to online
      if (data.user) {
        await supabase
          .from("users")
          .update({ status: "online", last_seen: new Date().toISOString() })
          .eq("id", data.user.id)
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw new Error("Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Update user status to offline before logging out
      if (user) {
        await supabase
          .from("users")
          .update({ status: "offline", last_seen: new Date().toISOString() })
          .eq("id", user.id)
      }

      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("Logout failed:", error)
      Alert.alert("Error", "Failed to logout")
    }
  }

  const updateStatus = async (status: "online" | "away" | "offline") => {
    if (user) {
      try {
        await supabase.from("users").update({ status, last_seen: new Date().toISOString() }).eq("id", user.id)

        setUser({ ...user, status })
      } catch (error) {
        console.error("Failed to update status:", error)
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
