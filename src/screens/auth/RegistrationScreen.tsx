"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import { User, Mail, Lock, Phone } from "lucide-react-native"
import { spacing, typography } from "../../design/designSystem"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"

const RegistrationScreen = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    username?: string
    email?: string
    phoneNumber?: string
    password?: string
    confirmPassword?: string
  }>({})

  const navigation = useNavigation()
  const { register } = useAuth()
  const { colors } = useTheme()

  const validateForm = () => {
    const newErrors: {
      username?: string
      email?: string
      phoneNumber?: string
      password?: string
      confirmPassword?: string
    } = {}

    if (!username) {
      newErrors.username = "Username is required"
    }

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!/^\+?[0-9]{10,15}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await register(username, phoneNumber, password, email)
      Alert.alert("Registration Successful", "Your account has been created successfully. You can now login.", [
        { text: "OK", onPress: () => navigation.navigate("Login" as never) },
      ])
    } catch (error) {
      Alert.alert("Registration Failed", error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
        <Card style={styles.formCard}>
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>

          <Input
            label="Username"
            placeholder="Choose a username"
            value={username}
            onChangeText={(text) => {
              setUsername(text)
              if (errors.username) setErrors({ ...errors, username: undefined })
            }}
            autoCapitalize="none"
            leftIcon={<User size={20} color={colors.textSecondary} />}
            error={errors.username}
          />

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text)
              if (errors.email) setErrors({ ...errors, email: undefined })
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color={colors.textSecondary} />}
            error={errors.email}
          />

          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(text)
              if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: undefined })
            }}
            keyboardType="phone-pad"
            leftIcon={<Phone size={20} color={colors.textSecondary} />}
            error={errors.phoneNumber}
          />

          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={(text) => {
              setPassword(text)
              if (errors.password) setErrors({ ...errors, password: undefined })
            }}
            isPassword
            leftIcon={<Lock size={20} color={colors.textSecondary} />}
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text)
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined })
            }}
            isPassword
            leftIcon={<Lock size={20} color={colors.textSecondary} />}
            error={errors.confirmPassword}
          />

          <Button onPress={handleRegister} isLoading={isLoading} fullWidth size="lg" style={styles.registerButton}>
            Register
          </Button>

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: colors.textSecondary }]}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login" as never)}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>Login</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.xl,
  },
  formCard: {
    width: "100%",
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  registerButton: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: typography.fontSize.md,
    marginRight: spacing.xs,
  },
  loginLink: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold as any,
  },
})

export default RegistrationScreen
