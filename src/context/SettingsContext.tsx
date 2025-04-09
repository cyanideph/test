"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "../utils/supabaseClient"
import type { AppSettings } from "../models/types"
import { useAuth } from "./AuthContext"

interface SettingsContextType {
  settings: AppSettings
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>
  isKeypadLocked: boolean
  unlockKeypad: (pin: string) => boolean
  lockKeypad: () => void
  toggleOfflineMode: () => Promise<void>
}

const defaultSettings: AppSettings = {
  theme: "default",
  notifications: true,
  autoLogin: true,
  keypadLock: false,
  keypadLockPin: "",
  offlineMode: false,
  fontSizeLevel: "medium",
  soundEnabled: true,
  vibrationEnabled: true,
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [isKeypadLocked, setIsKeypadLocked] = useState<boolean>(false)

  useEffect(() => {
    // Load settings from Supabase
    const loadSettings = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase.from("user_settings").select("*").eq("user_id", user.id).single()

        if (error) {
          console.error("Failed to load settings:", error)

          // Create default settings if not found
          if (error.code === "PGRST116") {
            // Record not found
            await supabase.from("user_settings").insert([{ user_id: user.id }])
          }

          return
        }

        if (data) {
          const loadedSettings: AppSettings = {
            theme: data.theme || defaultSettings.theme,
            notifications: data.notifications !== null ? data.notifications : defaultSettings.notifications,
            autoLogin: data.auto_login !== null ? data.auto_login : defaultSettings.autoLogin,
            keypadLock: data.keypad_lock !== null ? data.keypad_lock : defaultSettings.keypadLock,
            keypadLockPin: data.keypad_lock_pin || defaultSettings.keypadLockPin,
            offlineMode: data.offline_mode !== null ? data.offline_mode : defaultSettings.offlineMode,
            chatBackgroundImage: data.chat_background_image || undefined,
            fontSizeLevel: data.font_size_level || defaultSettings.fontSizeLevel,
            soundEnabled: data.sound_enabled !== null ? data.sound_enabled : defaultSettings.soundEnabled,
            vibrationEnabled:
              data.vibration_enabled !== null ? data.vibration_enabled : defaultSettings.vibrationEnabled,
            lastBackupDate: data.last_backup_date ? new Date(data.last_backup_date).getTime() : undefined,
          }

          setSettings(loadedSettings)

          // If keypad lock is enabled, lock the app on startup
          if (loadedSettings.keypadLock) {
            setIsKeypadLocked(true)
          }
        }
      } catch (error) {
        console.error("Failed to load settings:", error)
      }
    }

    loadSettings()
  }, [user])

  // Fix settings synchronization between camelCase in code and snake_case in database
  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    if (!user) return

    try {
      const updatedSettings = { ...settings, ...newSettings }

      // Map camelCase to snake_case for database
      const { error } = await supabase.from("user_settings").upsert({
        user_id: user.id,
        theme: updatedSettings.theme,
        notifications: updatedSettings.notifications,
        auto_login: updatedSettings.autoLogin, // Note the conversion
        keypad_lock: updatedSettings.keypadLock, // Note the conversion
        keypad_lock_pin: updatedSettings.keypadLockPin, // Note the conversion
        offline_mode: updatedSettings.offlineMode, // Note the conversion
        chat_background_image: updatedSettings.chatBackgroundImage,
        font_size_level: updatedSettings.fontSizeLevel,
        sound_enabled: updatedSettings.soundEnabled,
        vibration_enabled: updatedSettings.vibrationEnabled,
        last_backup_date: updatedSettings.lastBackupDate
          ? new Date(updatedSettings.lastBackupDate).toISOString()
          : null,
      })

      if (error) throw error
      setSettings(updatedSettings)
    } catch (error) {
      console.error("Failed to update settings:", error)
      throw error
    }
  }

  const unlockKeypad = (pin: string): boolean => {
    if (pin === settings.keypadLockPin) {
      setIsKeypadLocked(false)
      return true
    }
    return false
  }

  const lockKeypad = () => {
    if (settings.keypadLock && settings.keypadLockPin) {
      setIsKeypadLocked(true)
    }
  }

  const toggleOfflineMode = async () => {
    try {
      const newOfflineMode = !settings.offlineMode
      await updateSettings({ offlineMode: newOfflineMode })
    } catch (error) {
      console.error("Failed to toggle offline mode:", error)
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        isKeypadLocked,
        unlockKeypad,
        lockKeypad,
        toggleOfflineMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
