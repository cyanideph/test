"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput, Modal } from "react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import { UserPlus, Edit2, Trash2, LogOut, MessageSquare, X } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"
import { useChat } from "../../context/ChatContext"
import { useContacts } from "../../context/ContactContext"
import { useAuth } from "../../context/AuthContext"

const GroupDetailsScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { getChatRoom, updateChatRoom, leaveGroup, removeParticipantFromGroup, clearChatHistory } = useChat()
  const { contacts } = useContacts()
  const { user } = useAuth()

  const { roomId } = route.params as { roomId: string }
  const chatRoom = getChatRoom(roomId)

  const [showRenameModal, setShowRenameModal] = useState(false)
  const [newGroupName, setNewGroupName] = useState(chatRoom?.name || "")

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      alignItems: "center",
    },
    groupName: {
      fontSize: 22,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    groupInfo: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.primary,
      marginLeft: 16,
      marginTop: 16,
      marginBottom: 8,
      textTransform: "uppercase",
    },
    memberItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    memberAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.secondary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    avatarText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    memberInfo: {
      flex: 1,
    },
    memberName: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    memberPhone: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
    },
    adminBadge: {
      backgroundColor: colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      marginLeft: 8,
    },
    adminBadgeText: {
      color: "white",
      fontSize: 12,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    actionButtonText: {
      fontSize: 16,
      marginLeft: 12,
      color: colors.text,
    },
    dangerButton: {
      color: colors.notification,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      width: "80%",
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 16,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 16,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      backgroundColor: colors.card,
      color: colors.text,
      marginBottom: 16,
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    modalButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 4,
      marginLeft: 8,
    },
    cancelButton: {
      backgroundColor: colors.border,
    },
    saveButton: {
      backgroundColor: colors.primary,
    },
    buttonText: {
      color: "white",
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

  const isAdmin = user?.id === chatRoom.groupAdmin

  const groupMembers = chatRoom.participants.map((participantId) => {
    const contact = contacts.find((c) => c.id === participantId)
    return {
      id: participantId,
      name: contact?.name || "Unknown User",
      phoneNumber: contact?.phoneNumber || "",
      isAdmin: participantId === chatRoom.groupAdmin,
    }
  })

  const handleRenameGroup = async () => {
    if (!newGroupName.trim()) {
      Alert.alert("Error", "Please enter a group name")
      return
    }

    try {
      await updateChatRoom(roomId, { name: newGroupName.trim() })
      setShowRenameModal(false)
      Alert.alert("Success", "Group name updated successfully")
    } catch (error) {
      console.error("Failed to rename group:", error)
      Alert.alert("Error", "Failed to rename group")
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!isAdmin) {
      Alert.alert("Error", "Only group admin can remove members")
      return
    }

    Alert.alert("Remove Member", "Are you sure you want to remove this member from the group?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await removeParticipantFromGroup(roomId, memberId)
            Alert.alert("Success", "Member removed from group")
          } catch (error) {
            console.error("Failed to remove member:", error)
            Alert.alert("Error", "Failed to remove member")
          }
        },
      },
    ])
  }

  const handleLeaveGroup = () => {
    Alert.alert("Leave Group", "Are you sure you want to leave this group?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Leave",
        style: "destructive",
        onPress: async () => {
          try {
            await leaveGroup(roomId)
            navigation.goBack()
          } catch (error) {
            console.error("Failed to leave group:", error)
            Alert.alert("Error", "Failed to leave group")
          }
        },
      },
    ])
  }

  const handleClearHistory = () => {
    Alert.alert(
      "Clear Chat History",
      "Are you sure you want to clear all messages in this group? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await clearChatHistory(roomId)
              Alert.alert("Success", "Chat history cleared")
            } catch (error) {
              console.error("Failed to clear chat history:", error)
              Alert.alert("Error", "Failed to clear chat history")
            }
          },
        },
      ],
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.groupName}>{chatRoom.name}</Text>
        <Text style={styles.groupInfo}>
          {chatRoom.participants.length} members • Created on {new Date(chatRoom.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Members</Text>
        <FlatList
          data={groupMembers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.memberItem}>
              <View style={styles.memberAvatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
              </View>

              <View style={styles.memberInfo}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.memberName}>{item.name}</Text>
                  {item.isAdmin && (
                    <View style={styles.adminBadge}>
                      <Text style={styles.adminBadgeText}>Admin</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.memberPhone}>{item.phoneNumber}</Text>
              </View>

              {isAdmin && item.id !== user?.id && (
                <TouchableOpacity onPress={() => handleRemoveMember(item.id)}>
                  <X size={20} color={colors.notification} />
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>

        {isAdmin && (
          <>
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowRenameModal(true)}>
              <Edit2 size={20} color={colors.primary} />
              <Text style={styles.actionButtonText}>Rename Group</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("AddGroupMembers" as never, { roomId } as never)}
            >
              <UserPlus size={20} color={colors.primary} />
              <Text style={styles.actionButtonText}>Add Members</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Chat" as never, { roomId, name: chatRoom.name } as never)}
        >
          <MessageSquare size={20} color={colors.primary} />
          <Text style={styles.actionButtonText}>Go to Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleClearHistory}>
          <Trash2 size={20} color={colors.notification} />
          <Text style={[styles.actionButtonText, styles.dangerButton]}>Clear Chat History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleLeaveGroup}>
          <LogOut size={20} color={colors.notification} />
          <Text style={[styles.actionButtonText, styles.dangerButton]}>Leave Group</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showRenameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRenameModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename Group</Text>

            <TextInput
              style={styles.input}
              placeholder="Group Name"
              placeholderTextColor="#94a3b8"
              value={newGroupName}
              onChangeText={setNewGroupName}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowRenameModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleRenameGroup}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default GroupDetailsScreen
