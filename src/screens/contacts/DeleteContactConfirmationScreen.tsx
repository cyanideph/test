"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { AlertTriangle, Trash2 } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"
import { useContacts } from "../../context/ContactContext"

const DeleteContactConfirmationScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { colors } = useTheme()
  const { getContact, deleteContact } = useContacts()
  const [isDeleting, setIsDeleting] = useState(false)

  const { contactId } = route.params as { contactId: string }
  const contact = getContact(contactId)

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
      marginBottom: 24,
    },
    contactInfo: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 24,
    },
    contactName: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    contactPhone: {
      fontSize: 16,
      color: colors.text,
      opacity: 0.7,
    },
    warningBox: {
      backgroundColor: colors.notification + "20", // Add transparency
      borderRadius: 8,
      padding: 16,
      marginBottom: 24,
      flexDirection: "row",
      alignItems: "center",
    },
    warningIcon: {
      marginRight: 12,
    },
    warningText: {
      flex: 1,
      fontSize: 14,
      color: colors.notification,
    },
    buttonContainer: {
      marginTop: 16,
    },
    deleteButton: {
      backgroundColor: colors.notification,
      height: 50,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
    },
    deleteButtonText: {
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

  if (!contact) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.text }}>Contact not found</Text>
      </View>
    )
  }

  const handleDeleteContact = async () => {
    setIsDeleting(true)
    try {
      await deleteContact(contactId)
      Alert.alert("Contact Deleted", "The contact has been deleted successfully", [
        { text: "OK", onPress: () => navigation.navigate("ContactsList" as never) },
      ])
    } catch (error) {
      console.error("Failed to delete contact:", error)
      Alert.alert("Error", "Failed to delete contact")
      setIsDeleting(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AlertTriangle size={64} color={colors.notification} style={styles.icon} />
        <Text style={styles.title}>Delete Contact</Text>
        <Text style={styles.subtitle}>Are you sure you want to delete this contact? This action cannot be undone.</Text>
      </View>

      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <Text style={styles.contactPhone}>{contact.phoneNumber}</Text>
      </View>

      <View style={styles.warningBox}>
        <AlertTriangle size={24} color={colors.notification} style={styles.warningIcon} />
        <Text style={styles.warningText}>
          Deleting this contact will remove them from your contacts list and any groups they are part of.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteContact} disabled={isDeleting}>
          {isDeleting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Trash2 size={20} color="white" />
              <Text style={styles.deleteButtonText}>Delete Contact</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={isDeleting}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default DeleteContactConfirmationScreen
