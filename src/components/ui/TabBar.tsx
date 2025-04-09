"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { spacing, typography } from "../../design/designSystem"

export interface TabItem {
  key: string
  label: string
  icon?: React.ReactNode
  badge?: number | string
}

interface TabBarProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (tabKey: string) => void
  scrollable?: boolean
  variant?: "default" | "pills" | "underline"
  fullWidth?: boolean
}

const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onChange,
  scrollable = false,
  variant = "default",
  fullWidth = false,
}) => {
  const { colors } = useTheme()
  const [tabWidths, setTabWidths] = useState<Record<string, number>>({})
  const [containerWidth, setContainerWidth] = useState(0)
  const indicatorAnim = useRef(new Animated.Value(0)).current
  const indicatorWidthAnim = useRef(new Animated.Value(0)).current
  const scrollViewRef = useRef<ScrollView>(null)

  // Measure tab widths
  const measureTab = (tabKey: string, width: number) => {
    setTabWidths((prev) => ({
      ...prev,
      [tabKey]: width,
    }))
  }

  // Calculate indicator position and width
  useEffect(() => {
    if (!tabWidths[activeTab]) return

    let position = 0
    for (const tab of tabs) {
      if (tab.key === activeTab) break
      position += tabWidths[tab.key] || 0
    }

    Animated.parallel([
      Animated.timing(indicatorAnim, {
        toValue: position,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(indicatorWidthAnim, {
        toValue: tabWidths[activeTab],
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start()

    // Scroll to active tab if scrollable
    if (scrollable && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: position - containerWidth / 2 + tabWidths[activeTab] / 2,
        animated: true,
      })
    }
  }, [activeTab, tabWidths, containerWidth, tabs, indicatorAnim, indicatorWidthAnim, scrollable])

  const renderTab = (tab: TabItem) => {
    const isActive = tab.key === activeTab

    // Determine tab styles based on variant
    let tabStyle = {}
    let textStyle = { color: isActive ? colors.primary : colors.textSecondary }

    if (variant === "pills") {
      tabStyle = {
        backgroundColor: isActive ? colors.primary : "transparent",
        borderRadius: 16,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
      }
      textStyle = { color: isActive ? "white" : colors.textSecondary }
    }

    return (
      <TouchableOpacity
        key={tab.key}
        style={[styles.tab, fullWidth && styles.fullWidthTab, tabStyle]}
        onPress={() => onChange(tab.key)}
        onLayout={(e) => measureTab(tab.key, e.nativeEvent.layout.width)}
      >
        {tab.icon && <View style={styles.tabIcon}>{tab.icon}</View>}
        <Text style={[styles.tabText, textStyle]}>{tab.label}</Text>
        {tab.badge && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>{tab.badge}</Text>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  const renderIndicator = () => {
    if (variant === "pills") return null

    return (
      <Animated.View
        style={[
          styles.indicator,
          {
            backgroundColor: colors.primary,
            left: indicatorAnim,
            width: indicatorWidthAnim,
          },
        ]}
      />
    )
  }

  return (
    <View style={styles.container} onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      {scrollable ? (
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {tabs.map(renderTab)}
        </ScrollView>
      ) : (
        <View style={styles.tabsContainer}>{tabs.map(renderTab)}</View>
      )}
      {renderIndicator()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  scrollContent: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
  },
  tabsContainer: {
    flexDirection: "row",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  fullWidthTab: {
    flex: 1,
  },
  tabIcon: {
    marginRight: spacing.xs,
  },
  tabText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium as any,
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.xs,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "white",
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold as any,
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    height: 2,
  },
})

export default TabBar
