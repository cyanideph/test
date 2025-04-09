"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Archive, MessageSquare, Trash2, Download } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"
import { useChat } from "../../context/ChatContext"
import { formatDistanceToNow } from "date-fns"

const StoredMessagesScreen = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { getStoredMessages, getChatRoom } = useChat()

  const [isLoading, setIsLoading] = useState(true)
  const [storedMessages, setStoredMessages] = useState<any[]>([])

  useEffect(() => {
    const loadStoredMessages = async () => {
      setIsLoading(true)
      try {
        const messages = await getStoredMessages()

        // Transform messages into a flat list with room info
        const flattenedMessages: any[] = []

        Object.entries(messages).forEach(([roomId, roomMessages]) => {
          const room = getChatRoom(roomId)
          if (room) {
            roomMessages.forEach((message) => {
              flattenedMessages.push({
                ...message,
                roomId,
                roomName: room.name,
              })
            })
          }
        })

        // Sort by timestamp, newest first
        flattenedMessages.sort((a, b) => b.timestamp - a.timestamp)

        setStoredMessages(flattenedMessages)
      } catch (error) {
        console.error("Failed to load stored messages:", error)
        Alert.alert("Error", "Failed to load stored messages")
      } finally {
        setIsLoading(false)
      }
    }

    loadStoredMessages()
  }, [])

  const getMessagePreview = (message: any) => {
    switch (message.type) {
      case "text":
        return message.content
      case "emoticon":
        return "Emoticon"
      case "audio":
        return "Audio message"
      case "image":
        return "Image"
      default:
        return "Message"
    }
  }

  const handleOpenChat = (roomId: string, roomName: string) => {
    navigation.navigate("Chat" as never, { roomId, name: roomName } as never)
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
    },
    headerIcon: {
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
    },
    messageItem: {
      flexDirection: "row",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    messageIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    messageInfo: {
      flex: 1,
    },
    messageHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    roomName: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    timestamp: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.7,
    },
    senderName: {
      fontSize: 14,
      color: colors.primary,
      marginBottom: 4,
    },
    messagePreview: {
      fontSize: 14,
      color: colors.text,
    },
    actionButtons: {
      flexDirection: "row",
      marginTop: 8,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 16,
    },
    actionButtonText: {
      fontSize: 12,
      color: colors.primary,
      marginLeft: 4,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    emptyText: {
      fontSize: 16,
      color: colors.text,
      opacity: 0.7,
      textAlign: "center",
      marginBottom: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  })

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 16 }}>Loading stored messages...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Archive size={24} color={colors.primary} style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Stored Messages</Text>
      </View>

      {storedMessages.length > 0 ? (
        <FlatList
          data={storedMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.messageItem}>
              <View style={styles.messageIcon}>
                <MessageSquare size={20} color="white" />
              </View>

              <View style={styles.messageInfo}>
                <View style={styles.messageHeader}>
                  <Text style={styles.roomName}>{item.roomName}</Text>
                  <Text style={styles.timestamp}>
                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  </Text>
                </View>

                <Text style={styles.senderName}>{item.senderName}</Text>
                <Text style={styles.messagePreview}>{getMessagePreview(item)}</Text>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleOpenChat(item.roomId, item.roomName)}
                  >
                    <MessageSquare size={16} color={colors.primary} />
                    <Text style={styles.actionButtonText}>Open Chat</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton}>
                    <Download size={16} color={colors.primary} />
                    <Text style={styles.actionButtonText}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton}>
                    <Trash2 size={16} color={colors.notification} />
                    <Text style={[styles.actionButtonText, { color: colors.notification }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No stored messages found. Messages are stored when you enable offline mode.
          </Text>
        </View>
      )}
    </View>
  )
}

export default StoredMessagesScreen
