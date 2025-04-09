"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
  TouchableOpacity,
  Platform,
} from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { spacing, borderRadius, typography } from "../../design/designSystem"
import { Eye, EyeOff, AlertCircle } from "lucide-react-native"

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  helper?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  containerStyle?: ViewStyle
  inputStyle?: ViewStyle
  isPassword?: boolean
  fullWidth?: boolean
  variant?: "outline" | "filled" | "underline"
  size?: "sm" | "md" | "lg"
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  isPassword = false,
  secureTextEntry,
  fullWidth = false,
  variant = "outline",
  size = "md",
  ...rest
}) => {
  const { colors } = useTheme()
  const [isFocused, setIsFocused] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry)

  const handleFocus = (e) => {
    setIsFocused(true)
    if (rest.onFocus) {
      rest.onFocus(e)
    }
  }

  const handleBlur = (e) => {
    setIsFocused(false)
    if (rest.onBlur) {
      rest.onBlur(e)
    }
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const getBorderColor = () => {
    if (error) return colors.error
    if (isFocused) return colors.primary
    return colors.divider
  }

  const getInputContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
    }

    // Size styles
    switch (size) {
      case "sm":
        baseStyle.height = 40
        break
      case "lg":
        baseStyle.height = 56
        break
      default: // md
        baseStyle.height = 48
    }

    // Variant styles
    switch (variant) {
      case "filled":
        baseStyle.backgroundColor = colors.surfaceHighlight
        baseStyle.borderRadius = borderRadius.md
        break
      case "underline":
        baseStyle.borderBottomWidth = 1
        baseStyle.borderBottomColor = getBorderColor()
        break
      default: // outline
        baseStyle.borderWidth = 1
        baseStyle.borderColor = getBorderColor()
        baseStyle.borderRadius = borderRadius.md
    }

    // Width style
    if (fullWidth) {
      baseStyle.width = "100%"
    }

    return baseStyle
  }

  const getInputStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex: 1,
      color: colors.text,
      fontSize:
        size === "sm" ? typography.fontSize.sm : size === "lg" ? typography.fontSize.lg : typography.fontSize.md,
    }

    // Padding based on icons
    baseStyle.paddingLeft = leftIcon ? 0 : spacing.md
    baseStyle.paddingRight = rightIcon || isPassword ? 0 : spacing.md

    return baseStyle
  }

  return (
    <View style={[styles.container, fullWidth && { width: "100%" }, containerStyle]}>
      {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}

      <View style={[styles.inputContainer, getInputContainerStyles()]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[styles.input, getInputStyles(), inputStyle]}
          placeholderTextColor={colors.textTertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isPassword ? !isPasswordVisible : secureTextEntry}
          {...rest}
        />

        {isPassword ? (
          <TouchableOpacity style={styles.rightIcon} onPress={togglePasswordVisibility}>
            {isPasswordVisible ? (
              <EyeOff size={20} color={colors.textSecondary} />
            ) : (
              <Eye size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        ) : (
          rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={14} color={colors.error} />
          <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
        </View>
      )}

      {helper && !error && <Text style={[styles.helper, { color: colors.textTertiary }]}>{helper}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
    fontWeight: typography.fontWeight.medium as any,
  },
  inputContainer: {
    overflow: "hidden",
  },
  input: {
    height: "100%",
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },
  leftIcon: {
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
  },
  rightIcon: {
    paddingRight: spacing.md,
    paddingLeft: spacing.sm,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  error: {
    fontSize: typography.fontSize.sm,
    marginLeft: spacing.xs,
  },
  helper: {
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
  },
})

export default Input
