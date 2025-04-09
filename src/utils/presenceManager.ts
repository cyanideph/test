"use client"

import { supabase } from "./supabaseClient"
import { useEffect, useState } from "react"

// Status types
export type UserStatus = "online" | "away" | "offline" | "busy" | "invisible"

// Interface for presence state
interface PresenceState {
  status: UserStatus
  lastSeen: number
}

/**
 * Update the user's presence status in Supabase
 * @param userId User ID
 * @param status User status
 */
export const updatePresence = async (userId: string, status: UserStatus): Promise<void> => {
  try {
    const { error } = await supabase.from("user_presence").upsert(
      {
        user_id: userId,
        status,
        last_seen: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      },
    )

    if (error) {
      console.error("Error updating presence:", error)
    }
  } catch (error) {
    console.error("Error updating presence:", error)
  }
}

/**
 * Get a user's presence status
 * @param userId User ID
 * @returns User's presence state
 */
export const getPresence = async (userId: string): Promise<PresenceState | null> => {
  try {
    const { data, error } = await supabase
      .from("user_presence")
      .select("status, last_seen")
      .eq("user_id", userId)
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      return null
    }

    return {
      status: data.status as UserStatus,
      lastSeen: new Date(data.last_seen).getTime(),
    }
  } catch (error) {
    console.error("Error getting presence:", error)
    return null
  }
}

/**
 * React hook to subscribe to a user's presence changes
 * @param userId User ID
 * @returns User's current presence state
 */
export const usePresence = (userId: string): PresenceState | null => {
  const [presence, setPresence] = useState<PresenceState | null>(null)

  useEffect(() => {
    // Initial fetch
    const fetchPresence = async () => {
      const initialPresence = await getPresence(userId)
      if (initialPresence) {
        setPresence(initialPresence)
      }
    }

    fetchPresence()

    // Subscribe to changes
    const subscription = supabase
      .channel(`presence:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_presence",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newData = payload.new as any
          setPresence({
            status: newData.status as UserStatus,
            lastSeen: new Date(newData.last_seen).getTime(),
          })
        },
      )
      .subscribe()

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [userId])

  return presence
}

/**
 * Set up automatic presence tracking
 * @param userId User ID
 * @param initialStatus Initial status
 */
export const setupPresenceTracking = (userId: string, initialStatus: UserStatus = "online"): (() => void) => {
  // Create presence channel
  const channel = supabase.channel(`presence:${userId}`)

  // Track presence
  channel
    .on("presence", { event: "sync" }, () => {
      // Handle presence sync
      const state = channel.presenceState()
      console.log("Presence state:", state)
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        // Track user's presence
        await channel.track({
          user_id: userId,
          online_at: new Date().toISOString(),
          status: initialStatus,
        })
      }
    })

  // Update presence in database
  updatePresence(userId, initialStatus)

  // Set up interval to update presence
  const interval = setInterval(() => {
    updatePresence(userId, initialStatus)
  }, 60000) // Every minute

  // Set up event listeners for app state changes
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      updatePresence(userId, initialStatus)
    } else {
      updatePresence(userId, "away")
    }
  })

  // Return cleanup function
  return () => {
    clearInterval(interval)
    updatePresence(userId, "offline")
    channel.unsubscribe()
  }
}
