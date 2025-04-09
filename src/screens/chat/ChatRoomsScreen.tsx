"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Plus, MessageSquare, Search } from "lucide-react-native"
import { useChat } from "../../context/ChatContext"
import { useTheme } from "../../context/ThemeContext"
import { formatDistanceToNow } from "date-fns"
import { spacing, typography, shadows } from "../../design/designSystem"
import Avatar from "../../components/ui/Avatar"
import Badge from "../../components/ui/Badge"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"

const ChatRoomsScreen = () => {
  const navigation = useNavigation()
  const { chatRooms, createChatRoom } = useChat()
  const { colors } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadChatRooms = async () => {
      setIsLoading(true)
      try {
        // This is just a placeholder - the actual loading happens in ChatContext
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        console.error("Failed to load chat rooms:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadChatRooms()
  }, [])

  const handleCreateChatRoom = async () => {
    navigation.navigate("GroupChatCreation" as never)
  }

  const filteredChatRooms = chatRooms.filter((room) => room.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const renderChatRoom = ({ item }) => {
    const lastMessageTime = item.lastMessage?.timestamp
      ? formatDistanceToNow(new Date(item.lastMessage.timestamp), { addSuffix: true })
      : ""

    // Determine message preview based on type
    let messagePreview = "No messages yet"
    if (item.lastMessage) {
      switch (item.lastMessage.type) {
        case "text":
          messagePreview = item.lastMessage.content
          break
        case "emoticon":
          messagePreview = "Sent an emoticon"
          break
        case "audio":
          messagePreview = "Sent an audio message"
          break
        case "image":
          messagePreview = "Sent an image"
          break
      }
    }

    return (
      <TouchableOpacity
        style={[styles.chatRoomItem, { borderBottomColor: colors.divider }]}
        onPress={() => {
          navigation.navigate(
            "Chat" as never,
            {
              roomId: item.id,
              name: item.name,
            } as never,
          )
        }}
        activeOpacity={0.7}
      >
        <Avatar
          name={item.name}
          size="lg"
          status={item.isGroup ? null : "online"} // Just for demo, should be dynamic
        />

        <View style={styles.chatRoomInfo}>
          <View style={styles.chatRoomHeader}>
            <Text style={[styles.chatRoomName, { color: colors.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.chatRoomTime, { color: colors.textTertiary }]}>{lastMessageTime}</Text>
          </View>

          <View style={styles.chatRoomPreview}>
            <Text style={[styles.chatRoomMessage, { color: colors.textSecondary }]} numberOfLines={1}>
              {messagePreview}
            </Text>

            {item.unreadCount > 0 && (
              <Badge variant="primary" size="sm">
                {item.unreadCount}
              </Badge>
            )}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <MessageSquare size={64} color={colors.textTertiary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No Conversations Yet</Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        Start chatting with friends and family by creating a new chat.
      </Text>
      <Button onPress={handleCreateChatRoom} leftIcon={<Plus size={18} color="white" />} style={styles.emptyButton}>
        Start a New Chat
      </Button>
    </View>
  )

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading conversations...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Input
          placeholder="Search conversations"
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={colors.textSecondary} />}
          containerStyle={styles.searchInputContainer}
        />
      </View>

      <FlatList
        data={filteredChatRooms}
        keyExtractor={(item) => item.id}
        renderItem={renderChatRoom}
        contentContainerStyle={filteredChatRooms.length === 0 ? { flex: 1 } : null}
        ListEmptyComponent={renderEmptyComponent}
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }, shadows.md]}
        onPress={handleCreateChatRoom}
      >
        <Plus color="white" size={24} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
  },
  searchContainer: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  searchInputContainer: {
    marginBottom: 0,
  },
  chatRoomItem: {
    flexDirection: "row",
    padding: spacing.md,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  chatRoomInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: "center",
  },
  chatRoomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  chatRoomName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold as any,
    flex: 1,
    marginRight: spacing.sm,
  },
  chatRoomTime: {
    fontSize: typography.fontSize.xs,
  },
  chatRoomPreview: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatRoomMessage: {
    fontSize: typography.fontSize.sm,
    flex: 1,
    marginRight: spacing.sm,
  },
  fab: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold as any,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  emptyButton: {
    marginTop: spacing.md,
  },
})

export default ChatRoomsScreen
