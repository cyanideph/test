"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Trash2, AlertTriangle } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"
import { useChat } from "../../context/ChatContext"

const ClearHistoryConfirmationScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { colors } = useTheme()
  const { chatRooms, clearChatHistory, clearAllChatHistory } = useChat()
  const [isClearing, setIsClearing] = useState(false)
  const [selectedRooms, setSelectedRooms] = useState<string[]>([])

  const { mode } = route.params as { mode: "all" | "selected" }

  const handleToggleRoom = (roomId: string) => {
    if (selectedRooms.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter((id) => id !== roomId))
    } else {
      setSelectedRooms([...selectedRooms, roomId])
    }
  }

  const handleClearHistory = async () => {
    setIsClearing(true)
    try {
      if (mode === "all") {
        await clearAllChatHistory()
        Alert.alert("Success", "All chat history has been cleared", [
          { text: "OK", onPress: () => navigation.goBack() },
        ])
      } else {
        if (selectedRooms.length === 0) {
          Alert.alert("Error", "Please select at least one chat to clear")
          setIsClearing(false)
          return
        }

        for (const roomId of selectedRooms) {
          await clearChatHistory(roomId)
        }

        Alert.alert("Success", "Selected chat histories have been cleared", [
          { text: "OK", onPress: () => navigation.goBack() },
        ])
      }
    } catch (error) {
      console.error("Failed to clear chat history:", error)
      Alert.alert("Error", "Failed to clear chat history")
    } finally {
      setIsClearing(false)
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    warningIcon: {
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    description: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
      textAlign: "center",
      marginBottom: 16,
    },
    roomItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    roomAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    avatarText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    roomInfo: {
      flex: 1,
    },
    roomName: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    roomPreview: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
    },
    checkBox: {
      width: 24,
      height: 24,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    checkBoxSelected: {
      backgroundColor: colors.primary,
    },
    buttonContainer: {
      padding: 16,
    },
    clearButton: {
      backgroundColor: colors.notification,
      height: 50,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
    },
    clearButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 8,
    },
    cancelButton: {
      backgroundColor: colors.border,
      height: 50,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 12,
    },
    cancelButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "bold",
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AlertTriangle size={48} color={colors.notification} style={styles.warningIcon} />
        <Text style={styles.title}>Clear Chat History</Text>
        <Text style={styles.description}>
          {mode === "all"
            ? "This will permanently delete all your chat history. This action cannot be undone."
            : "Select the chats you want to clear. This action cannot be undone."}
        </Text>
      </View>

      {mode === "selected" && (
        <FlatList
          data={chatRooms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.roomItem} onPress={() => handleToggleRoom(item.id)}>
              <View style={styles.roomAvatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
              </View>

              <View style={styles.roomInfo}>
                <Text style={styles.roomName}>{item.name}</Text>
                <Text style={styles.roomPreview}>{item.lastMessage?.content || "No messages"}</Text>
              </View>

              <View style={[styles.checkBox, selectedRooms.includes(item.id) && styles.checkBoxSelected]}>
                {selectedRooms.includes(item.id) && <Text style={{ color: "white" }}>✓</Text>}
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearHistory}
          disabled={isClearing || (mode === "selected" && selectedRooms.length === 0)}
        >
          {isClearing ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Trash2 size={20} color="white" />
              <Text style={styles.clearButtonText}>
                {mode === "all" ? "Clear All Chat History" : "Clear Selected Chats"}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={isClearing}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ClearHistoryConfirmationScreen
