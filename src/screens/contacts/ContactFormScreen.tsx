"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../../context/ThemeContext"

const ContactFormScreen = () => {
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()
  const { colors } = useTheme()

  const handleSave = async () => {
    // Basic validation
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a name")
      return
    }

    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Please enter a phone number")
      return
    }

    // Simple phone number validation
    const phoneRegex = /^\+?[0-9]{10,15}$/
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert("Error", "Please enter a valid phone number")
      return
    }

    setIsLoading(true)
    try {
      // In a real app, you would save the contact to a database or API
      // For now, we'll just simulate a delay and go back
      await new Promise((resolve) => setTimeout(resolve, 1000))

      Alert.alert("Success", "Contact saved successfully", [{ text: "OK", onPress: () => navigation.goBack() }])
    } catch (error) {
      Alert.alert("Error", "Failed to save contact")
    } finally {
      setIsLoading(false)
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
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
    button: {
      backgroundColor: colors.primary,
      height: 50,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
  })

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter contact name"
          placeholderTextColor="#94a3b8"
          value={name}
          onChangeText={setName}
        />
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
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? "Saving..." : "Save Contact"}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default ContactFormScreen
