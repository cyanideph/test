"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions, ScrollView } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { spacing, borderRadius, typography, shadows } from "../../design/designSystem"
import { ChevronDown, Check } from "lucide-react-native"

export interface DropdownItem {
  label: string
  value: string | number
  icon?: React.ReactNode
  disabled?: boolean
}

interface DropdownMenuProps {
  items: DropdownItem[]
  selectedValue?: string | number
  onSelect: (value: string | number) => void
  placeholder?: string
  disabled?: boolean
  label?: string
  error?: string
  width?: number | string
  maxHeight?: number
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  selectedValue,
  onSelect,
  placeholder = "Select an option",
  disabled = false,
  label,
  error,
  width = "100%",
  maxHeight = 300,
}) => {
  const { colors } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const dropdownRef = useRef<View>(null)
  const fadeAnim = useRef(new Animated.Value(0)).current

  const selectedItem = items.find((item) => item.value === selectedValue)

  useEffect(() => {
    if (isOpen) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [isOpen, fadeAnim])

  const toggleDropdown = () => {
    if (disabled) return

    if (!isOpen) {
      // Measure the position of the dropdown trigger
      dropdownRef.current?.measure((x, y, width, height, pageX, pageY) => {
        setPosition({
          x: pageX,
          y: pageY + height,
          width,
          height,
        })
        setIsOpen(true)
      })
    } else {
      setIsOpen(false)
    }
  }

  const handleSelect = (item: DropdownItem) => {
    if (item.disabled) return
    onSelect(item.value)
    setIsOpen(false)
  }

  const windowHeight = Dimensions.get("window").height
  const showAbove = position.y > windowHeight / 2

  return (
    <View style={[styles.container, { width }]}>
      {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}

      <TouchableOpacity
        ref={dropdownRef}
        style={[
          styles.trigger,
          {
            borderColor: error ? colors.error : colors.divider,
            backgroundColor: colors.surface,
          },
          disabled && styles.disabled,
        ]}
        onPress={toggleDropdown}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <View style={styles.triggerContent}>
          {selectedItem?.icon && <View style={styles.selectedIcon}>{selectedItem.icon}</View>}
          <Text
            style={[styles.triggerText, { color: selectedItem ? colors.text : colors.textTertiary }]}
            numberOfLines={1}
          >
            {selectedItem ? selectedItem.label : placeholder}
          </Text>
        </View>
        <ChevronDown size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}

      <Modal visible={isOpen} transparent animationType="none" onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setIsOpen(false)}>
          <Animated.View
            style={[
              styles.dropdown,
              {
                top: showAbove ? position.y - maxHeight - position.height : position.y,
                left: position.x,
                width: position.width,
                maxHeight,
                backgroundColor: colors.background,
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [showAbove ? -10 : 10, 0],
                    }),
                  },
                ],
                ...shadows.lg,
              },
            ]}
          >
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.value.toString()}
                  style={[styles.item, item.disabled && styles.disabledItem, { borderBottomColor: colors.divider }]}
                  onPress={() => handleSelect(item)}
                  disabled={item.disabled}
                  activeOpacity={0.7}
                >
                  <View style={styles.itemContent}>
                    {item.icon && <View style={styles.itemIcon}>{item.icon}</View>}
                    <Text
                      style={[styles.itemText, { color: item.disabled ? colors.textTertiary : colors.text }]}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                  </View>
                  {item.value === selectedValue && <Check size={18} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
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
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  triggerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedIcon: {
    marginRight: spacing.sm,
  },
  triggerText: {
    fontSize: typography.fontSize.md,
    flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  error: {
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  dropdown: {
    position: "absolute",
    borderRadius: borderRadius.md,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  itemIcon: {
    marginRight: spacing.sm,
  },
  itemText: {
    fontSize: typography.fontSize.md,
  },
  disabledItem: {
    opacity: 0.5,
  },
})

export default DropdownMenu
