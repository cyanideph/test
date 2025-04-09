"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Check, Users, MessageSquare, Trash2 } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"
import { useContacts } from "../../context/ContactContext"
import { useChat } from "../../context/ChatContext"

const MultipleContactHandlerScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { colors } = useTheme()
  const { contacts, contactGroups, addContactToGroup } = useContacts()
  const { createChatRoom } = useChat()

  const { selectedContactIds, action } = route.params as {
    selectedContactIds: string[]
    action: "message" | "delete" | "addToGroup"
  }

  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)

  const selectedContacts = contacts.filter((contact) => selectedContactIds.includes(contact.id))

  const handleCreateGroupChat = async () => {
    setIsProcessing(true)
    try {
      const roomId = await createChatRoom("New Group Chat", selectedContactIds, true)
      Alert.alert("Success", "Group chat created successfully", [
        {
          text: "Open Chat",
          onPress: () => navigation.navigate("Chat" as never, { roomId, name: "New Group Chat" } as never),
        },
      ])
    } catch (error) {
      console.error("Failed to create group chat:", error)
      Alert.alert("Error", "Failed to create group chat")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteContacts = () => {
    Alert.alert(
      "Delete Contacts",
      `Are you sure you want to delete ${selectedContacts.length} contacts? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            navigation.navigate("DeleteContact" as never, { contactIds: selectedContactIds } as never)
          },
        },
      ],
    )
  }

  const handleAddToGroup = async () => {
    if (!selectedGroupId) {
      Alert.alert("Error", "Please select a group")
      return
    }

    setIsProcessing(true)
    try {
      for (const contactId of selectedContactIds) {
        await addContactToGroup(contactId, selectedGroupId)
      }

      const groupName = contactGroups.find((group) => group.id === selectedGroupId)?.name || "group"
      Alert.alert("Success", `Added ${selectedContacts.length} contacts to ${groupName}`, [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    } catch (error) {
      console.error("Failed to add contacts to group:", error)
      Alert.alert("Error", "Failed to add contacts to group")
    } finally {
      setIsProcessing(false)
    }
  }

  const renderActionContent = () => {
    switch (action) {
      case "message":
        return (
          <View>
            <Text style={styles.actionTitle}>Create Group Chat</Text>
            <Text style={styles.actionDescription}>
              Create a new group chat with the {selectedContacts.length} selected contacts.
            </Text>
            <TouchableOpacity style={styles.actionButton} onPress={handleCreateGroupChat} disabled={isProcessing}>
              {isProcessing ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <MessageSquare size={20} color="white" />
                  <Text style={styles.actionButtonText}>Create Group Chat</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )
      case "delete":
        return (
          <View>
            <Text style={styles.actionTitle}>Delete Contacts</Text>
            <Text style={styles.actionDescription}>
              Delete the {selectedContacts.length} selected contacts. This action cannot be undone.
            </Text>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.notification }]}
              onPress={handleDeleteContacts}
            >
              <Trash2 size={20} color="white" />
              <Text style={styles.actionButtonText}>Delete {selectedContacts.length} Contacts</Text>
            </TouchableOpacity>
          </View>
        )
      case "addToGroup":
        return (
          <View>
            <Text style={styles.actionTitle}>Add to Group</Text>
            <Text style={styles.actionDescription}>
              Add the {selectedContacts.length} selected contacts to an existing group.
            </Text>

            <Text style={styles.sectionTitle}>Select a Group</Text>
            <FlatList
              data={contactGroups}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.groupItem, selectedGroupId === item.id && styles.selectedGroupItem]}
                  onPress={() => setSelectedGroupId(item.id)}
                >
                  <View style={styles.groupIcon}>
                    <Users size={20} color="white" />
                  </View>
                  <View style={styles.groupInfo}>
                    <Text style={styles.groupName}>{item.name}</Text>
                    <Text style={styles.groupCount}>{item.contacts.length} contacts</Text>
                  </View>
                  {selectedGroupId === item.id && (
                    <View style={styles.checkIcon}>
                      <Check size={20} color={colors.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              )}
              style={styles.groupList}
            />

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleAddToGroup}
              disabled={isProcessing || !selectedGroupId}
            >
              {isProcessing ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Users size={20} color="white" />
                  <Text style={styles.actionButtonText}>Add to Group</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )
      default:
        return null
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    header: {
      marginBottom: 24,
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
    },
    selectedContactsContainer: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 24,
    },
    selectedContactsTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
    },
    contactAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.secondary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    avatarText: {
      color: "white",
      fontSize: 14,
      fontWeight: "bold",
    },
    contactName: {
      fontSize: 14,
      color: colors.text,
    },
    actionContainer: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 24,
    },
    actionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    actionDescription: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
      marginBottom: 16,
    },
    actionButton: {
      backgroundColor: colors.primary,
      height: 50,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
    },
    actionButtonText: {
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
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
    },
    groupList: {
      maxHeight: 200,
      marginBottom: 16,
    },
    groupItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      marginBottom: 8,
    },
    selectedGroupItem: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "10",
    },
    groupIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.secondary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    groupInfo: {
      flex: 1,
    },
    groupName: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    groupCount: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
    },
    checkIcon: {
      marginLeft: 8,
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Multiple Contact Action</Text>
        <Text style={styles.subtitle}>{selectedContacts.length} contacts selected</Text>
      </View>

      <View style={styles.selectedContactsContainer}>
        <Text style={styles.selectedContactsTitle}>Selected Contacts</Text>
        <FlatList
          data={selectedContacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.contactItem}>
              <View style={styles.contactAvatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
              </View>
              <Text style={styles.contactName}>{item.name}</Text>
            </View>
          )}
          scrollEnabled={selectedContacts.length > 5}
          style={{ maxHeight: 200 }}
        />
      </View>

      <View style={styles.actionContainer}>{renderActionContent()}</View>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={isProcessing}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MultipleContactHandlerScreen
