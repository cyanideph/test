"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { MessageSquare, Send } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"

const SMSHandlerScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { colors } = useTheme()

  const { phoneNumber } = route.params as { phoneNumber?: string }
  const [message, setMessage] = useState("")
  const [recipient, setRecipient] = useState(phoneNumber || "")
  const [isSending, setIsSending] = useState(false)

  const handleSendSMS = async () => {
    if (!recipient.trim()) {
      Alert.alert("Error", "Please enter a phone number")
      return
    }

    if (!message.trim()) {
      Alert.alert("Error", "Please enter a message")
      return
    }

    setIsSending(true)

    try {
      // In a real app, this would use a native SMS API
      // For now, we'll simulate sending an SMS
      await new Promise((resolve) => setTimeout(resolve, 1500))

      Alert.alert("SMS Sent", `Your message has been sent to ${recipient}`, [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    } catch (error) {
      console.error("Failed to send SMS:", error)
      Alert.alert("Error", "Failed to send SMS")
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
      height: 150,
      textAlignVertical: "top",
      paddingTop: 12,
    },
    charCount: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.7,
      textAlign: "right",
      marginTop: 4,
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
        <MessageSquare size={64} color={colors.primary} style={styles.icon} />
        <Text style={styles.title}>Send SMS</Text>
        <Text style={styles.subtitle}>Send a text message to invite someone to UZZAP</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Recipient</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          placeholderTextColor="#94a3b8"
          value={recipient}
          onChangeText={setRecipient}
          keyboardType="phone-pad"
          editable={!phoneNumber} // If phone number is provided, don't allow editing
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, styles.messageInput]}
          placeholder="Type your message here"
          placeholderTextColor="#94a3b8"
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={160}
        />
        <Text style={styles.charCount}>{message.length}/160 characters</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSendSMS}
        disabled={isSending || !recipient.trim() || !message.trim()}
      >
        {isSending ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Send size={20} color="white" />
            <Text style={styles.buttonText}>Send SMS</Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.infoText}>
        Standard SMS rates may apply. Make sure the recipient has given you permission to send them messages.
      </Text>
    </View>
  )
}

export default SMSHandlerScreen
