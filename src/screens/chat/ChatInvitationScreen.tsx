"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Send, UserPlus } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"
import { useChat } from "../../context/ChatContext"
import { useContacts } from "../../context/ContactContext"

const ChatInvitationScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { colors } = useTheme()
  const { createChatRoom } = useChat()
  const { contacts } = useContacts()

  const { contactId } = route.params as { contactId?: string }
  const contact = contactId ? contacts.find((c) => c.id === contactId) : undefined

  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState(contact?.phoneNumber || "")

  const handleSendInvitation = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Please enter a phone number")
      return
    }

    setIsSending(true)

    try {
      // In a real app, this would send an SMS or other invitation
      // For now, we'll simulate the process

      // Check if this is an existing contact
      const existingContact = contacts.find((c) => c.phoneNumber === phoneNumber.trim())

      if (existingContact) {
        // Create a chat room with this contact
        const roomId = await createChatRoom(existingContact.name, [existingContact.id])

        // If there's a message, send it
        if (message.trim()) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        }

        Alert.alert("Invitation Sent", `Chat invitation sent to ${existingContact.name}`, [
          {
            text: "Open Chat",
            onPress: () => navigation.navigate("Chat" as never, { roomId, name: existingContact.name } as never),
          },
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ])
      } else {
        // Simulate sending SMS invitation
        await new Promise((resolve) => setTimeout(resolve, 1500))

        Alert.alert("Invitation Sent", `An SMS invitation has been sent to ${phoneNumber}`, [
          { text: "OK", onPress: () => navigation.goBack() },
        ])
      }
    } catch (error) {
      console.error("Failed to send invitation:", error)
      Alert.alert("Error", "Failed to send invitation")
    } finally {
      setIsSending(false)
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
    },
    messageInput: {
      height: 100,
      textAlignVertical: "top",
      paddingTop: 12,
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
    infoText: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
      textAlign: "center",
      marginTop: 20,
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <UserPlus size={64} color={colors.primary} style={styles.icon} />
        <Text style={styles.title}>Invite to UZZAP</Text>
        <Text style={styles.subtitle}>Send an invitation to chat on UZZAP</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          placeholderTextColor="#94a3b8"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          editable={!contactId} // If contact is provided, don't allow editing
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Message (Optional)</Text>
        <TextInput
          style={[styles.input, styles.messageInput]}
          placeholder="Add a personal message"
          placeholderTextColor="#94a3b8"
          value={message}
          onChangeText={setMessage}
          multiline
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSendInvitation}
        disabled={isSending || !phoneNumber.trim()}
      >
        {isSending ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Send size={20} color="white" />
            <Text style={styles.buttonText}>Send Invitation</Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.infoText}>
        An SMS invitation will be sent to this number if they don't already have UZZAP installed.
      </Text>
    </View>
  )
}

export default ChatInvitationScreen
