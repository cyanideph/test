"use client"

import type React from "react"
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  type ViewStyle,
  type TextStyle,
  type TouchableOpacityProps,
  StyleSheet,
} from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { spacing, borderRadius, typography } from "../../design/designSystem"

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "warning"
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl"

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  rounded?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  rounded = false,
  style,
  textStyle,
  disabled,
  ...rest
}) => {
  const { colors } = useTheme()

  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: rounded ? borderRadius.full : borderRadius.md,
    }

    // Size styles
    switch (size) {
      case "xs":
        baseStyle.paddingVertical = spacing.xs / 2
        baseStyle.paddingHorizontal = spacing.sm
        break
      case "sm":
        baseStyle.paddingVertical = spacing.xs
        baseStyle.paddingHorizontal = spacing.md
        break
      case "lg":
        baseStyle.paddingVertical = spacing.md
        baseStyle.paddingHorizontal = spacing.xl
        break
      case "xl":
        baseStyle.paddingVertical = spacing.lg
        baseStyle.paddingHorizontal = spacing["2xl"]
        break
      default: // md
        baseStyle.paddingVertical = spacing.sm
        baseStyle.paddingHorizontal = spacing.lg
    }

    // Variant styles
    switch (variant) {
      case "secondary":
        baseStyle.backgroundColor = colors.secondary
        break
      case "outline":
        baseStyle.backgroundColor = "transparent"
        baseStyle.borderWidth = 1
        baseStyle.borderColor = colors.primary
        break
      case "ghost":
        baseStyle.backgroundColor = "transparent"
        break
      case "danger":
        baseStyle.backgroundColor = colors.error
        break
      case "success":
        baseStyle.backgroundColor = colors.success
        break
      case "warning":
        baseStyle.backgroundColor = colors.warning
        break
      default: // primary
        baseStyle.backgroundColor = colors.primary
    }

    // Width style
    if (fullWidth) {
      baseStyle.width = "100%"
    }

    // Disabled style
    if (disabled || isLoading) {
      baseStyle.opacity = 0.6
    }

    return baseStyle
  }

  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: typography.fontWeight.medium as TextStyle["fontWeight"],
    }

    // Size styles
    switch (size) {
      case "xs":
        baseStyle.fontSize = typography.fontSize.xs
        break
      case "sm":
        baseStyle.fontSize = typography.fontSize.sm
        break
      case "lg":
        baseStyle.fontSize = typography.fontSize.lg
        break
      case "xl":
        baseStyle.fontSize = typography.fontSize.xl
        break
      default: // md
        baseStyle.fontSize = typography.fontSize.md
    }

    // Variant styles
    switch (variant) {
      case "outline":
      case "ghost":
        baseStyle.color = colors.primary
        break
      default:
        baseStyle.color = "white"
    }

    return baseStyle
  }

  const iconSpacing = {
    xs: spacing.xs / 2,
    sm: spacing.xs,
    md: spacing.sm,
    lg: spacing.sm,
    xl: spacing.md,
  }

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyles(), style]}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "outline" || variant === "ghost" ? colors.primary : "white"}
          size={size === "xs" || size === "sm" ? "small" : "small"}
        />
      ) : (
        <>
          {leftIcon && <View style={{ marginRight: iconSpacing[size] }}>{leftIcon}</View>}
          <Text style={[styles.text, getTextStyles(), textStyle]}>{children}</Text>
          {rightIcon && <View style={{ marginLeft: iconSpacing[size] }}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    minHeight: 40,
  },
  text: {
    textAlign: "center",
  },
})

export default Button
