"use client"

import type React from "react"
import { createContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import { useContacts } from "./ContactContext"
import { supabase } from "../utils/supabaseClient"
import { updatePresence } from "../utils/presenceManager"

type StatusType = "online" | "away" | "offline" | "busy" | "invisible"

interface StatusIndicatorContextType {
  userStatus: StatusType
  setUserStatus: (status: StatusType) => void
  getContactStatus: (contactId: string) => StatusType
  updateContactStatus: (contactId: string, status: StatusType) => void
  statusColors: {
    online: string
    away: string
    offline: string
    busy: string
    invisible: string
  }
}

const StatusIndicatorContext = createContext<StatusIndicatorContextType | undefined>(undefined)

export const StatusIndicatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateStatus } = useAuth()
  const { contacts } = useContacts()
  const [userStatus, setUserStatus] = useState<StatusType>("online")
  const [contactStatuses, setContactStatuses] = useState<Record<string, StatusType>>({})
  const [presenceChannel, setPresenceChannel] = useState<any>(null)

  // Status colors
  const statusColors = {
    online: "#22c55e",
    away: "#f59e0b",
    offline: "#94a3b8",
    busy: "#ef4444",
    invisible: "#64748b",
  }

  useEffect(() => {
    // Set up presence channel when user logs in
    if (user) {
      const channel = supabase.channel(`presence:${user.id}`)

      channel
        .on("presence", { event: "sync" }, () => {
          // Handle presence sync
          const state = channel.presenceState()
          console.log("Presence state:", state)
        })
        .on("presence", { event: "join" }, ({ key, newPresences }) => {
          // Handle user joining
          console.log("User joined:", key, newPresences)
        })
        .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
          // Handle user leaving
          console.log("User left:", key, leftPresences)
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            // Track user's presence
            await channel.track({
              user_id: user.id,
              online_at: new Date().toISOString(),
              status: userStatus,
            })
          }
        })

      setPresenceChannel(channel)

      // Set initial status based on user
      if (user.status) {
        setUserStatus(user.status as StatusType)
      }

      // Update presence when component mounts
      updatePresence(user.id, userStatus)

      // Set up interval to update presence
      const interval = setInterval(() => {
        updatePresence(user.id, userStatus)
      }, 60000) // Every minute

      // Set up automatic away status after inactivity
      let inactivityTimer: NodeJS.Timeout | null = null

      const resetTimer = () => {
        if (inactivityTimer) {
          clearTimeout(inactivityTimer)
        }

        // Set to away after 5 minutes of inactivity
        if (userStatus === "online") {
          inactivityTimer = setTimeout(
            () => {
              setUserStatus("away")
              updateStatus("away")
              updatePresence(user.id, "away")
            },
            5 * 60 * 1000,
          )
        }
      }

      // User activity listeners
      const activityEvents = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"]

      activityEvents.forEach((event) => {
        document.addEventListener(event, resetTimer)
      })

      // Start the timer
      resetTimer()

      // Clean up
      return () => {
        if (inactivityTimer) {
          clearTimeout(inactivityTimer)
        }

        clearInterval(interval)

        activityEvents.forEach((event) => {
          document.removeEventListener(event, resetTimer)
        })

        updatePresence(user.id, "offline")
        channel.unsubscribe()
      }
    }
  }, [user, userStatus, updateStatus])

  // Subscribe to contact statuses
  useEffect(() => {
    if (!user || contacts.length === 0) return

    // Subscribe to presence updates for all contacts
    const contactIds = contacts.map((contact) => contact.id)

    const subscriptions = contactIds.map((contactId) => {
      return supabase
        .channel(`presence:${contactId}`)
        .on("presence", { event: "sync" }, () => {
          // Update contact status in state
          const state = supabase.channel(`presence:${contactId}`).presenceState()
          if (state && state[contactId]) {
            setContactStatuses((prev) => ({
              ...prev,
              [contactId]: state[contactId][0].status,
            }))
          }
        })
        .subscribe()
    })

    // Initial fetch of contact statuses
    const fetchContactStatuses = async () => {
      try {
        const { data, error } = await supabase.from("user_presence").select("user_id, status").in("user_id", contactIds)

        if (!error && data) {
          const statuses: Record<string, StatusType> = {}
          data.forEach((item) => {
            statuses[item.user_id] = item.status as StatusType
          })
          setContactStatuses(statuses)
        }
      } catch (error) {
        console.error("Failed to fetch contact statuses:", error)
      }
    }

    fetchContactStatuses()

    // Clean up subscriptions
    return () => {
      subscriptions.forEach((subscription) => {
        subscription.unsubscribe()
      })
    }
  }, [user, contacts])

  // Function to update user status
  const handleSetUserStatus = async (status: StatusType) => {
    if (!user) return

    setUserStatus(status)

    // Update in auth context
    updateStatus(status)

    // Update in presence system
    updatePresence(user.id, status)

    // Update presence channel
    if (presenceChannel) {
      await presenceChannel.track({
        user_id: user.id,
        online_at: new Date().toISOString(),
        status,
      })
    }
  }

  // Function to get a contact's status
  const getContactStatus = (contactId: string): StatusType => {
    return contactStatuses[contactId] || "offline"
  }

  // Function to update a contact's status (for testing)
  const updateContactStatus = async (contactId: string, status: StatusType) => {
    setContactStatuses((prev) => ({
      ...prev,
      [contactId]: status,
    }))
  }

  return (
    <StatusIndicatorContext.Provider
      value={{
        userStatus,
        setUserStatus: handleSetUserStatus,
        getContactStatus,
        updateContactStatus,
        statusColors,
      }}
    >
      {children}
    </StatusIndicatorContext.Provider>
  )
}

export const useStatusIndicator = () => {
  const context = createContext(StatusIndicatorContext)
  if (context === undefined) {
    throw new Error("useStatusIndicator must be used within a StatusIndicatorProvider")
  }
  return context
}
