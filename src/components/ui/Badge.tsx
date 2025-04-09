"use client"

import type React from "react"
import { View, Text, type ViewStyle, type TextStyle } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { borderRadius, spacing, typography } from "../../design/designSystem"

export type BadgeVariant = "primary" | "secondary" | "success" | "warning" | "error" | "info" | "default"
export type BadgeSize = "sm" | "md" | "lg"

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  style?: ViewStyle
  textStyle?: TextStyle
}

const Badge: React.FC<BadgeProps> = ({ children, variant = "primary", size = "md", style, textStyle }) => {
  const { colors } = useTheme()

  const getBadgeStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.full,
      alignSelf: "flex-start",
    }

    // Size styles
    switch (size) {
      case "sm":
        baseStyle.paddingVertical = spacing.xs / 2
        baseStyle.paddingHorizontal = spacing.xs
        break
      case "lg":
        baseStyle.paddingVertical = spacing.sm
        baseStyle.paddingHorizontal = spacing.md
        break
      default: // md
        baseStyle.paddingVertical = spacing.xs
        baseStyle.paddingHorizontal = spacing.sm
    }

    // Variant styles
    switch (variant) {
      case "secondary":
        baseStyle.backgroundColor = colors.secondary
        break
      case "success":
        baseStyle.backgroundColor = colors.success
        break
      case "warning":
        baseStyle.backgroundColor = colors.warning
        break
      case "error":
        baseStyle.backgroundColor = colors.error
        break
      case "info":
        baseStyle.backgroundColor = colors.info
        break
      case "default":
        baseStyle.backgroundColor = colors.textTertiary
        break
      default: // primary
        baseStyle.backgroundColor = colors.primary
    }

    return baseStyle
  }

  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      color: "white",
      fontWeight: typography.fontWeight.medium as TextStyle["fontWeight"],
    }

    // Size styles
    switch (size) {
      case "sm":
        baseStyle.fontSize = typography.fontSize.xs
        break
      case "lg":
        baseStyle.fontSize = typography.fontSize.md
        break
      default: // md
        baseStyle.fontSize = typography.fontSize.sm
    }

    return baseStyle
  }

  return (
    <View style={[getBadgeStyles(), style]}>
      <Text style={[getTextStyles(), textStyle]}>{children}</Text>
    </View>
  )
}

export default Badge
