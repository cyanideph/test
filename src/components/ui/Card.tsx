"use client"

import type React from "react"
import { View, type ViewStyle, type ViewProps } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { borderRadius, shadows, spacing } from "../../design/designSystem"

interface CardProps extends ViewProps {
  children: React.ReactNode
  variant?: "elevated" | "outlined" | "filled"
  style?: ViewStyle
  padding?: "none" | "sm" | "md" | "lg"
}

const Card: React.FC<CardProps> = ({ children, variant = "elevated", style, padding = "md", ...rest }) => {
  const { colors } = useTheme()

  const getCardStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.md,
      overflow: "hidden",
    }

    // Padding
    switch (padding) {
      case "none":
        break
      case "sm":
        baseStyle.padding = spacing.sm
        break
      case "lg":
        baseStyle.padding = spacing.lg
        break
      default: // md
        baseStyle.padding = spacing.md
    }

    // Variant styles
    switch (variant) {
      case "outlined":
        baseStyle.borderWidth = 1
        baseStyle.borderColor = colors.divider
        baseStyle.backgroundColor = colors.background
        break
      case "filled":
        baseStyle.backgroundColor = colors.surfaceHighlight
        break
      default: // elevated
        baseStyle.backgroundColor = colors.surface
        Object.assign(baseStyle, shadows.md)
    }

    return baseStyle
  }

  return (
    <View style={[getCardStyles(), style]} {...rest}>
      {children}
    </View>
  )
}

export default Card
