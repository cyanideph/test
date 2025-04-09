"use client"

import type React from "react"
import { View, type ViewStyle } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { spacing } from "../../design/designSystem"

interface DividerProps {
  direction?: "horizontal" | "vertical"
  thickness?: number
  spacing?: "none" | "sm" | "md" | "lg"
  style?: ViewStyle
}

const Divider: React.FC<DividerProps> = ({
  direction = "horizontal",
  thickness = 1,
  spacing: spacingProp = "md",
  style,
}) => {
  const { colors } = useTheme()

  const getSpacingValue = () => {
    switch (spacingProp) {
      case "none":
        return 0
      case "sm":
        return spacing.sm
      case "lg":
        return spacing.lg
      default: // md
        return spacing.md
    }
  }

  const dividerStyle: ViewStyle = {
    backgroundColor: colors.divider,
    ...(direction === "horizontal"
      ? {
          height: thickness,
          marginVertical: getSpacingValue(),
        }
      : {
          width: thickness,
          marginHorizontal: getSpacingValue(),
        }),
  }

  return <View style={[dividerStyle, style]} />
}

export default Divider
