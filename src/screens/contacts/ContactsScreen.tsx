"use client"
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { UserPlus, MessageCircle } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"
import { useChat } from "../../context/ChatContext"

// Mock contacts data - in a real app, this would come from a context or API
const mockContacts = [
  { id: "1", name: "John Doe", phoneNumber: "+1234567890", status: "online" },
  { id: "2", name: "Jane Smith", phoneNumber: "+1987654321", status: "away" },
  { id: "3", name: "Bob Johnson", phoneNumber: "+1122334455", status: "offline" },
  { id: "4", name: "Alice Brown", phoneNumber: "+1555666777", status: "online" },
]

const ContactsScreen = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { createChatRoom } = useChat()

  const handleStartChat = async (contact) => {
    try {
      // Create a new chat room with this contact
      const roomId = await createChatRoom(contact.name, [contact.id])
      navigation.navigate(
        "Chats" as never,
        {
          screen: "Chat",
          params: { roomId, name: contact.name },
        } as never,
      )
    } catch (error) {
      console.error("Failed to create chat room:", error)
    }
  }

  const renderStatusIndicator = (status) => {
    let color
    switch (status) {
      case "online":
        color = colors.online
        break
      case "away":
        color = colors.away
        break
      default:
        color = colors.offline
    }

    return <View style={[styles.statusIndicator, { backgroundColor: color }]} />
  }

  const renderContact = ({ item }) => (
    <View style={styles.contactItem}>
      <View style={styles.contactAvatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        {renderStatusIndicator(item.status)}
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
      </View>
      <TouchableOpacity style={styles.chatButton} onPress={() => handleStartChat(item)}>
        <MessageCircle size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  )

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contactItem: {
      flexDirection: "row",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      alignItems: "center",
    },
    contactAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.secondary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
      position: "relative",
    },
    avatarText: {
      color: "white",
      fontSize: 20,
      fontWeight: "bold",
    },
    statusIndicator: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 14,
      height: 14,
      borderRadius: 7,
      borderWidth: 2,
      borderColor: colors.background,
    },
    contactInfo: {
      flex: 1,
    },
    contactName: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    contactPhone: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
    },
    chatButton: {
      padding: 8,
    },
    fab: {
      position: "absolute",
      bottom: 20,
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
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
      {mockContacts.length > 0 ? (
        <FlatList data={mockContacts} keyExtractor={(item) => item.id} renderItem={renderContact} />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You don't have any contacts yet. Add a contact to start chatting!</Text>
        </View>
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("ContactForm" as never)}>
        <UserPlus color="white" size={24} />
      </TouchableOpacity>
    </View>
  )
}

export default ContactsScreen
