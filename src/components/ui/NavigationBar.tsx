"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform, type ViewStyle } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { spacing, typography, shadows } from "../../design/designSystem"
import { ChevronLeft } from "lucide-react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface NavigationBarProps {
  title?: string
  leftComponent?: React.ReactNode
  rightComponent?: React.ReactNode
  onBackPress?: () => void
  showBackButton?: boolean
  transparent?: boolean
  style?: ViewStyle
  titleStyle?: ViewStyle
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  title,
  leftComponent,
  rightComponent,
  onBackPress,
  showBackButton = false,
  transparent = false,
  style,
  titleStyle,
}) => {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()

  const renderLeftComponent = () => {
    if (leftComponent) {
      return leftComponent
    }

    if (showBackButton) {
      return (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <ChevronLeft size={24} color={transparent ? "white" : colors.text} />
        </TouchableOpacity>
      )
    }

    return <View style={styles.placeholder} />
  }

  const renderRightComponent = () => {
    if (rightComponent) {
      return rightComponent
    }

    return <View style={styles.placeholder} />
  }

  return (
    <>
      <StatusBar
        barStyle={transparent ? "light-content" : Platform.OS === "ios" ? "dark-content" : "light-content"}
        backgroundColor={transparent ? "transparent" : colors.background}
        translucent={transparent}
      />
      <View
        style={[
          styles.container,
          {
            backgroundColor: transparent ? "transparent" : colors.background,
            paddingTop: transparent ? insets.top : 0,
            borderBottomColor: colors.divider,
            borderBottomWidth: transparent ? 0 : StyleSheet.hairlineWidth,
          },
          style,
        ]}
      >
        <View style={styles.content}>
          {renderLeftComponent()}
          {title && (
            <Text style={[styles.title, { color: transparent ? "white" : colors.text }, titleStyle]} numberOfLines={1}>
              {title}
            </Text>
          )}
          {renderRightComponent()}
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    ...shadows.sm,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold as any,
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  placeholder: {
    width: 40,
  },
})

export default NavigationBar
