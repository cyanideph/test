"use client"

import type React from "react"
import { View, Text, Image, StyleSheet } from "react-native"
import { useTheme } from "../../context/ThemeContext"

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"
type AvatarStatus = "online" | "away" | "offline" | "busy" | null

interface AvatarProps {
  source?: string | { uri: string }
  name?: string
  size?: AvatarSize
  status?: AvatarStatus
  showStatus?: boolean
  style?: any
}

const Avatar: React.FC<AvatarProps> = ({ source, name, size = "md", status = null, showStatus = true, style }) => {
  const { colors } = useTheme()

  const getInitials = (name: string) => {
    if (!name) return "?"

    const parts = name.trim().split(" ")
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase()
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  const getStatusColor = () => {
    switch (status) {
      case "online":
        return colors.online
      case "away":
        return colors.away
      case "busy":
        return colors.busy
      case "offline":
        return colors.offline
      default:
        return "transparent"
    }
  }

  const getDimensions = () => {
    switch (size) {
      case "xs":
        return { size: 24, fontSize: 10, statusSize: 6 }
      case "sm":
        return { size: 32, fontSize: 12, statusSize: 8 }
      case "lg":
        return { size: 56, fontSize: 20, statusSize: 12 }
      case "xl":
        return { size: 72, fontSize: 24, statusSize: 14 }
      default: // md
        return { size: 40, fontSize: 16, statusSize: 10 }
    }
  }

  const { size: avatarSize, fontSize, statusSize } = getDimensions()

  // Generate a consistent background color based on the name
  const getBackgroundColor = (name: string) => {
    if (!name) return colors?.primary

    const colorsList = [
      "#5c7cfa", // blue
      "#845ef7", // violet
      "#be4bdb", // grape
      "#f06595", // pink
      "#ff922b", // orange
      "#94d82d", // lime
      "#20c997", // teal
      "#22b8cf", // cyan
    ]

    const charCode = name.charCodeAt(0)
    return colorsList[charCode % colorsList.length]
  }

  return (
    <View style={[{ width: avatarSize, height: avatarSize }, style]}>
      {source ? (
        <Image
          source={typeof source === "string" ? { uri: source } : source}
          style={[
            styles.avatar,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.avatar,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              backgroundColor: name ? getBackgroundColor(name) : colors?.primary,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text style={{ color: "white", fontSize, fontWeight: "600" }}>{name ? getInitials(name) : "?"}</Text>
        </View>
      )}

      {showStatus && status && (
        <View
          style={[
            styles.statusIndicator,
            {
              width: statusSize,
              height: statusSize,
              borderRadius: statusSize / 2,
              backgroundColor: getStatusColor(),
              borderWidth: statusSize / 4,
              borderColor: colors.background,
            },
          ]}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    overflow: "hidden",
  },
  statusIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
})

export default Avatar
