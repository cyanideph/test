"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Edit2, Users } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"
import { useChat } from "../../context/ChatContext"

const GroupRenamerScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { colors } = useTheme()
  const { getChatRoom, updateChatRoom } = useChat()

  const { roomId } = route.params as { roomId: string }
  const chatRoom = getChatRoom(roomId)

  const [groupName, setGroupName] = useState(chatRoom?.name || "")
  const [isRenaming, setIsRenaming] = useState(false)

  const handleRenameGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Error", "Please enter a group name")
      return
    }

    setIsRenaming(true)
    try {
      await updateChatRoom(roomId, { name: groupName.trim() })
      Alert.alert("Success", "Group name updated successfully", [{ text: "OK", onPress: () => navigation.goBack() }])
    } catch (error) {
      console.error("Failed to rename group:", error)
      Alert.alert("Error", "Failed to rename group")
    } finally {
      setIsRenaming(false)
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    header: {
      alignItems: "center",
      marginBottom: 24,
    },
    icon: {
      marginBottom: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
      textAlign: "center",
    },
    formGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: colors.text,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      backgroundColor: colors.card,
      color: colors.text,
      fontSize: 16,
    },
    currentName: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
      marginTop: 8,
    },
    button: {
      backgroundColor: colors.primary,
      height: 50,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
      flexDirection: "row",
    },
    buttonText: {
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

  if (!chatRoom) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.text }}>Group not found</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Edit2 size={64} color={colors.primary} style={styles.icon} />
        <Text style={styles.title}>Rename Group</Text>
        <Text style={styles.subtitle}>Change the name of this group chat</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Group Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new group name"
          placeholderTextColor="#94a3b8"
          value={groupName}
          onChangeText={setGroupName}
          maxLength={30}
        />
        <Text style={styles.currentName}>Current name: {chatRoom.name}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleRenameGroup}
        disabled={isRenaming || !groupName.trim() || groupName === chatRoom.name}
      >
        {isRenaming ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Users size={20} color="white" />
            <Text style={styles.buttonText}>Rename Group</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={isRenaming}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  )
}

export default GroupRenamerScreen
