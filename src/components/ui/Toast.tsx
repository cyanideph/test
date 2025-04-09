"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { spacing, borderRadius, typography, shadows } from "../../design/designSystem"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react-native"

export type ToastType = "success" | "error" | "warning" | "info"

interface ToastProps {
  visible: boolean
  type?: ToastType
  message: string
  duration?: number
  onClose?: () => void
  action?: {
    label: string
    onPress: () => void
  }
}

const Toast: React.FC<ToastProps> = ({ visible, type = "info", message, duration = 3000, onClose, action }) => {
  const { colors } = useTheme()
  const [isVisible, setIsVisible] = useState(visible)
  const translateY = useRef(new Animated.Value(-100)).current
  const opacity = useRef(new Animated.Value(0)).current
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsVisible(visible)
    if (visible) {
      showToast()
    } else {
      hideToast()
    }
  }, [visible])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const showToast = () => {
    // Clear any existing timers
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Animate in
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()

    // Set timer to hide toast
    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        hideToast()
      }, duration)
    }
  }

  const hideToast = () => {
    // Animate out
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false)
      if (onClose) {
        onClose()
      }
    })
  }

  const getToastIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} color={colors.success} />
      case "error":
        return <AlertCircle size={20} color={colors.error} />
      case "warning":
        return <AlertTriangle size={20} color={colors.warning} />
      default:
        return <Info size={20} color={colors.info} />
    }
  }

  const getToastColor = () => {
    switch (type) {
      case "success":
        return colors.success
      case "error":
        return colors.error
      case "warning":
        return colors.warning
      default:
        return colors.info
    }
  }

  if (!isVisible) {
    return null
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
          backgroundColor: colors.background,
          borderLeftColor: getToastColor(),
          ...shadows.md,
        },
      ]}
    >
      <View style={styles.iconContainer}>{getToastIcon()}</View>
      <Text style={[styles.message, { color: colors.text }]} numberOfLines={2}>
        {message}
      </Text>
      <View style={styles.actions}>
        {action && (
          <TouchableOpacity style={styles.actionButton} onPress={action.onPress}>
            <Text style={[styles.actionText, { color: getToastColor() }]}>{action.label}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.closeButton} onPress={hideToast}>
          <X size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    margin: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    zIndex: 9999,
    maxWidth: Dimensions.get("window").width - spacing.md * 2,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  message: {
    flex: 1,
    fontSize: typography.fontSize.sm,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  actionText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium as any,
  },
  closeButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
})

export default Toast
