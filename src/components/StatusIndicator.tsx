"use client"

import type React from "react"
import { View, StyleSheet } from "react-native"
import { useTheme } from "../context/ThemeContext"

type StatusType = "online" | "away" | "offline" | "busy" | "invisible"

interface StatusIndicatorProps {
  status: StatusType
  size?: "small" | "medium" | "large"
  showBorder?: boolean
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, size = "medium", showBorder = true }) => {
  const { colors } = useTheme()

  // Determine color based on status
  let statusColor
  switch (status) {
    case "online":
      statusColor = colors.online
      break
    case "away":
      statusColor = colors.away
      break
    case "busy":
      statusColor = colors.notification
      break
    case "invisible":
      statusColor = colors.border
      break
    default:
      statusColor = colors.offline
  }

  // Determine size
  let indicatorSize
  switch (size) {
    case "small":
      indicatorSize = 8
      break
    case "large":
      indicatorSize = 16
      break
    default:
      indicatorSize = 12
  }

  const styles = StyleSheet.create({
    indicator: {
      width: indicatorSize,
      height: indicatorSize,
      borderRadius: indicatorSize / 2,
      backgroundColor: statusColor,
      borderWidth: showBorder ? 2 : 0,
      borderColor: colors.background,
    },
  })

  return <View style={styles.indicator} />
}

export default StatusIndicator
