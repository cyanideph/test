"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Modal as RNModal,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
  type ViewStyle,
  Platform,
} from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { spacing, borderRadius, shadows, typography, animation } from "../../design/designSystem"
import { X } from "lucide-react-native"

interface ModalProps {
  isVisible: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  showCloseButton?: boolean
  closeOnBackdropPress?: boolean
  animationType?: "fade" | "slide" | "none"
  position?: "center" | "bottom"
  width?: number | string
  height?: number | string
  style?: ViewStyle
  contentStyle?: ViewStyle
}

const Modal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  children,
  title,
  showCloseButton = true,
  closeOnBackdropPress = true,
  animationType = "fade",
  position = "center",
  width = "85%",
  height,
  style,
  contentStyle,
}) => {
  const { colors } = useTheme()
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(Dimensions.get("window").height))

  useEffect(() => {
    if (isVisible) {
      // Animate in
      if (animationType === "fade" || animationType === "none") {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animationType === "none" ? 0 : animation.normal,
          useNativeDriver: true,
        }).start()
      } else if (animationType === "slide") {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 5,
        }).start()
      }
    } else {
      // Animate out
      if (animationType === "fade" || animationType === "none") {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: animationType === "none" ? 0 : animation.normal,
          useNativeDriver: true,
        }).start()
      } else if (animationType === "slide") {
        Animated.timing(slideAnim, {
          toValue: Dimensions.get("window").height,
          duration: animation.normal,
          useNativeDriver: true,
        }).start()
      }
    }
  }, [isVisible, animationType, fadeAnim, slideAnim])

  const getModalContainerStyle = () => {
    if (position === "bottom") {
      return {
        justifyContent: "flex-end",
        padding: 0,
      }
    }
    return {
      justifyContent: "center",
      padding: spacing.lg,
    }
  }

  const getModalContentStyle = () => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.background,
      borderRadius: borderRadius.lg,
      width: width,
      ...shadows.lg,
    }

    if (height) {
      baseStyle.height = height
    }

    if (position === "bottom") {
      baseStyle.borderTopLeftRadius = borderRadius.lg
      baseStyle.borderTopRightRadius = borderRadius.lg
      baseStyle.borderBottomLeftRadius = 0
      baseStyle.borderBottomRightRadius = 0
      baseStyle.width = "100%"
      baseStyle.paddingBottom = spacing.xl + (Platform.OS === "ios" ? 20 : 0) // Extra padding for iOS home indicator
    }

    return baseStyle
  }

  const animatedStyle =
    animationType === "slide"
      ? {
          transform: [{ translateY: slideAnim }],
        }
      : {
          opacity: fadeAnim,
        }

  return (
    <RNModal
      transparent
      visible={isVisible}
      onRequestClose={onClose}
      animationType="none" // We'll handle animations ourselves
    >
      <Animated.View style={[styles.backdrop, { backgroundColor: "rgba(0, 0, 0, 0.5)", opacity: fadeAnim }]}>
        <TouchableOpacity
          style={[styles.backdropTouchable, getModalContainerStyle()]}
          activeOpacity={1}
          onPress={closeOnBackdropPress ? onClose : undefined}
        >
          <Animated.View
            style={[styles.modalContent, getModalContentStyle(), animatedStyle, contentStyle]}
            // Stop propagation to prevent closing when clicking on content
          >
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()} style={{ flex: 1 }}>
              {(title || showCloseButton) && (
                <View style={styles.modalHeader}>
                  {title && <Text style={[styles.modalTitle, { color: colors.text }]}>{title}</Text>}
                  {showCloseButton && (
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                      <X size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                  )}
                </View>
              )}
              <View style={[styles.modalBody, style]}>{children}</View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </RNModal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdropTouchable: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  modalContent: {
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold as any,
    flex: 1,
  },
  closeButton: {
    padding: spacing.xs,
  },
  modalBody: {
    padding: spacing.lg,
  },
})

export default Modal
