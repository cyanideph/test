"use client"

import type React from "react"
import { View, Text, StyleSheet, Switch as RNSwitch, type ViewStyle } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { spacing, typography } from "../../design/designSystem"

interface SwitchProps {
  label?: string
  value: boolean
  onValueChange: (value: boolean) => void
  disabled?: boolean
  description?: string
  style?: ViewStyle
}

const Switch: React.FC<SwitchProps> = ({ label, value, onValueChange, disabled = false, description, style }) => {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        {(label || description) && (
          <View style={styles.labelContainer}>
            {label && (
              <Text style={[styles.label, { color: colors.text }, disabled && styles.disabledText]}>{label}</Text>
            )}
            {description && (
              <Text style={[styles.description, { color: colors.textSecondary }, disabled && styles.disabledText]}>
                {description}
              </Text>
            )}
          </View>
        )}
        <RNSwitch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{ false: colors.divider, true: colors.primary }}
          thumbColor="white"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  labelContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium as any,
    marginBottom: spacing.xs / 2,
  },
  description: {
    fontSize: typography.fontSize.sm,
  },
  disabledText: {
    opacity: 0.5,
  },
})

export default Switch
