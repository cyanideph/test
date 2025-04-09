"use client"

import type React from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { borderRadius, spacing, typography } from "../../design/designSystem"
import { format } from "date-fns"
import AudioMessagePlayer from "../AudioMessagePlayer"
import { Check, CheckCheck } from "lucide-react-native"

interface MessageBubbleProps {
  content: string
  timestamp: number
  isOwn: boolean
  isRead: boolean
  type: "text" | "emoticon" | "audio" | "image"
  metadata?: any
  onPress?: () => void
  onLongPress?: () => void
  senderName?: string
  showSender?: boolean
  style?: any
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  timestamp,
  isOwn,
  isRead,
  type,
  metadata,
  onPress,
  onLongPress,
  senderName,
  showSender = false,
  style,
}) => {
  const { colors, isDark } = useTheme()
  const scaleAnim = new Animated.Value(0.95)

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start()
  }

  const renderContent = () => {
    switch (type) {
      case "emoticon":
        return <Text style={styles.emoticonText}>{content}</Text>
      case "audio":
        return <AudioMessagePlayer uri={content} duration={metadata?.duration || 0} />
      case "image":
        return <Image source={{ uri: content }} style={styles.messageImage} resizeMode="cover" />
      default: // text
        return (
          <Text
            style={[
              styles.messageText,
              {
                color: isOwn ? "white" : colors.text,
              },
            ]}
          >
            {content}
          </Text>
        )
    }
  }

  const getBubbleStyle = () => {
    const baseStyle = [
      styles.bubble,
      isOwn
        ? [styles.ownBubble, { backgroundColor: colors.primary }]
        : [styles.otherBubble, { backgroundColor: isDark ? colors.surfaceHighlight : colors.surface }],
      type === "image" && styles.imageBubble,
    ]

    return baseStyle
  }

  return (
    <View style={[styles.container, isOwn ? styles.ownContainer : styles.otherContainer, style]}>
      {showSender && !isOwn && senderName && (
        <Text style={[styles.senderName, { color: colors.textSecondary }]}>{senderName}</Text>
      )}

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={getBubbleStyle()}
          onPress={onPress}
          onLongPress={onLongPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          disabled={!onPress && !onLongPress}
        >
          {renderContent()}
        </TouchableOpacity>
      </Animated.View>

      <View style={[styles.footer, isOwn ? styles.ownFooter : styles.otherFooter]}>
        <Text style={[styles.timestamp, { color: colors.textTertiary }]}>{format(new Date(timestamp), "h:mm a")}</Text>

        {isOwn && (
          <View style={styles.readStatus}>
            {isRead ? <CheckCheck size={14} color={colors.primary} /> : <Check size={14} color={colors.textTertiary} />}
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    maxWidth: "80%",
  },
  ownContainer: {
    alignSelf: "flex-end",
  },
  otherContainer: {
    alignSelf: "flex-start",
  },
  senderName: {
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.xs / 2,
    marginLeft: spacing.xs,
  },
  bubble: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    minWidth: 60,
  },
  ownBubble: {
    borderBottomRightRadius: spacing.xs,
  },
  otherBubble: {
    borderBottomLeftRadius: spacing.xs,
  },
  imageBubble: {
    padding: spacing.xs,
    overflow: "hidden",
  },
  messageText: {
    fontSize: typography.fontSize.md,
  },
  emoticonText: {
    fontSize: typography.fontSize["2xl"],
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: borderRadius.md,
  },
  footer: {
    flexDirection: "row",
    marginTop: spacing.xs / 2,
    alignItems: "center",
  },
  ownFooter: {
    justifyContent: "flex-end",
  },
  otherFooter: {
    justifyContent: "flex-start",
  },
  timestamp: {
    fontSize: typography.fontSize.xs,
    marginRight: spacing.sm,
  },
  readStatus: {
    marginLeft: spacing.xs / 2,
  },
})

export default MessageBubble
