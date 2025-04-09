"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { UserPlus, X, MessageSquare } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"
import { useContacts } from "../../context/ContactContext"
import { useChat } from "../../context/ChatContext"
import StatusIndicator from "../../components/StatusIndicator"

const GroupContactsViewScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { colors } = useTheme()
  const { contacts } = useContacts()
  const { getChatRoom, removeParticipantFromGroup, createChatRoom } = useChat()

  const { groupId, groupName } = route.params as { groupId: string; groupName: string }
  const chatRoom = getChatRoom(groupId)

  const [isRemoving, setIsRemoving] = useState(false)

  // Get contacts in this group
  const groupContacts = chatRoom
    ? chatRoom.participants
        .map((participantId) => contacts.find((contact) => contact.id === participantId))
        .filter((contact) => contact !== undefined)
    : []

  const handleRemoveFromGroup = (contactId: string, contactName: string) => {
    Alert.alert("Remove Contact", `Are you sure you want to remove ${contactName} from this group?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          setIsRemoving(true)
          try {
            await removeParticipantFromGroup(groupId, contactId)
            Alert.alert("Success", `${contactName} has been removed from the group`)
          } catch (error) {
            console.error("Failed to remove contact from group:", error)
            Alert.alert("Error", "Failed to remove contact from group")
          } finally {
            setIsRemoving(false)
          }
        },
      },
    ])
  }

  const handleStartChat = async (contact) => {
    try {
      // Create a new chat room with this contact
      const roomId = await createChatRoom(contact.name, [contact.id])
      navigation.navigate("Chat" as never, { roomId, name: contact.name } as never)
    } catch (error) {
      console.error("Failed to create chat room:", error)
      Alert.alert("Error", "Failed to create chat room")
    }
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
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
    },
    addButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    contactAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.secondary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
      position: "relative",
    },
    avatarText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    statusIndicator: {
      position: "absolute",
      bottom: 0,
      right: 0,
    },
    contactInfo: {
      flex: 1,
    },
    contactName: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    contactPhone: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
    },
    actionButtons: {
      flexDirection: "row",
    },
    actionButton: {
      padding: 8,
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
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{groupName} Members</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("GroupBuddyAdder" as never, { roomId: groupId } as never)}
          disabled={isRemoving}
        >
          <UserPlus size={20} color="white" />
        </TouchableOpacity>
      </View>

      {groupContacts.length > 0 ? (
        <FlatList
          data={groupContacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.contactItem}>
              <View style={styles.contactAvatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                <View style={styles.statusIndicator}>
                  <StatusIndicator status={item.status} size="small" />
                </View>
              </View>

              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleStartChat(item)}>
                  <MessageSquare size={20} color={colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleRemoveFromGroup(item.id, item.name)}
                  disabled={isRemoving}
                >
                  <X size={20} color={colors.notification} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>This group has no members yet. Add members to get started.</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("GroupBuddyAdder" as never, { roomId: groupId } as never)}
          >
            <UserPlus size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default GroupContactsViewScreen
