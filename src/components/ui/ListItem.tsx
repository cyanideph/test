"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, type ViewStyle } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { spacing, typography } from "../../design/designSystem"
import { ChevronRight } from "lucide-react-native"

interface ListItemProps {
  title: string
  subtitle?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showChevron?: boolean
  onPress?: () => void
  disabled?: boolean
  style?: ViewStyle
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  showChevron = false,
  onPress,
  disabled = false,
  style,
}) => {
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      style={[styles.container, { borderBottomColor: colors.divider }, disabled && { opacity: 0.5 }, style]}
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
    >
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>

      {rightIcon ? (
        <View style={styles.rightIcon}>{rightIcon}</View>
      ) : (
        showChevron && (
          <View style={styles.chevron}>
            <ChevronRight size={20} color={colors.textTertiary} />
          </View>
        )
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  leftIcon: {
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium as any,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs / 2,
  },
  rightIcon: {
    marginLeft: spacing.md,
  },
  chevron: {
    marginLeft: spacing.md,
  },
})

export default ListItem
