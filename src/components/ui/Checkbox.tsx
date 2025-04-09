"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, type ViewStyle } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { spacing, borderRadius, typography } from "../../design/designSystem"
import { Check } from "lucide-react-native"

interface CheckboxProps {
  label?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  error?: string
  style?: ViewStyle
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, disabled = false, error, style }) => {
  const { colors } = useTheme()

  const handlePress = () => {
    if (!disabled) {
      onChange(!checked)
    }
  }

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.row} onPress={handlePress} disabled={disabled} activeOpacity={0.7}>
        <View
          style={[
            styles.checkbox,
            {
              borderColor: error ? colors.error : checked ? colors.primary : colors.divider,
              backgroundColor: checked ? colors.primary : "transparent",
            },
            disabled && styles.disabled,
          ]}
        >
          {checked && <Check size={14} color="white" />}
        </View>
        {label && <Text style={[styles.label, { color: colors.text }, disabled && styles.disabledText]}>{label}</Text>}
      </TouchableOpacity>
      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: borderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    marginLeft: spacing.sm,
    fontSize: typography.fontSize.md,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
  error: {
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
    marginLeft: spacing.lg + spacing.xs,
  },
})

export default Checkbox
