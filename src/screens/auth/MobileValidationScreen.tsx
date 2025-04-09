"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useTheme } from "../../context/ThemeContext"

const MobileValidationScreen = () => {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()
  const route = useRoute()
  const { colors } = useTheme()

  // In a real app, you would get this from route params
  const phoneNumber = route.params?.phoneNumber || "+1234567890"

  const handleVerify = async () => {
    if (!code || code.length < 4) {
      Alert.alert("Error", "Please enter a valid verification code")
      return
    }

    setIsLoading(true)
    try {
      // In a real app, you would call an API to verify the code
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // If verification is successful, navigate to login
      Alert.alert("Success", "Phone number verified successfully", [
        { text: "OK", onPress: () => navigation.navigate("Login" as never) },
      ])
    } catch (error) {
      Alert.alert("Verification Failed", "Invalid code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = () => {
    Alert.alert("Code Resent", "A new verification code has been sent to your phone.")
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
      color: colors.text,
    },
    subtitle: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 30,
      color: colors.text,
      opacity: 0.7,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      marginBottom: 16,
      paddingHorizontal: 12,
      backgroundColor: colors.card,
      color: colors.text,
      fontSize: 18,
      textAlign: "center",
      letterSpacing: 8,
    },
    button: {
      backgroundColor: colors.primary,
      height: 50,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 16,
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    resendContainer: {
      marginTop: 30,
      alignItems: "center",
    },
    resendText: {
      color: colors.primary,
      fontSize: 16,
    },
  })

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Phone</Text>
      <Text style={styles.subtitle}>We've sent a verification code to {phoneNumber}</Text>

      <TextInput
        style={styles.input}
        placeholder="Code"
        placeholderTextColor="#94a3b8"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Verify</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.resendContainer} onPress={handleResendCode}>
        <Text style={styles.resendText}>Didn't receive a code? Resend</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MobileValidationScreen
