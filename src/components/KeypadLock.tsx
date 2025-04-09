"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from "react-native"
import { useSettings } from "../context/SettingsContext"
import { useTheme } from "../context/ThemeContext"
import { Lock, X } from "lucide-react-native"

interface KeypadLockProps {
  onUnlock: () => void
}

const KeypadLock: React.FC<KeypadLockProps> = ({ onUnlock }) => {
  const { colors } = useTheme()
  const { unlockKeypad } = useSettings()
  const [pin, setPin] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimer, setLockTimer] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer((prev) => prev - 1)
      }, 1000)
    } else if (isLocked && lockTimer === 0) {
      setIsLocked(false)
      setAttempts(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isLocked, lockTimer])

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + digit)
    }
  }

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1))
  }

  const handleClear = () => {
    setPin("")
  }

  const handleUnlock = () => {
    if (unlockKeypad(pin)) {
      setPin("")
      setAttempts(0)
      onUnlock()
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      setPin("")

      if (newAttempts >= 3) {
        setIsLocked(true)
        setLockTimer(30) // Lock for 30 seconds after 3 failed attempts
        Alert.alert("Too many attempts", "Please try again after 30 seconds")
      } else {
        Alert.alert("Incorrect PIN", `Please try again. ${3 - newAttempts} attempts remaining.`)
      }
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
      padding: 20,
    },
    lockIcon: {
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 30,
    },
    pinContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 30,
    },
    pinDot: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.border,
      margin: 8,
    },
    pinDotFilled: {
      backgroundColor: colors.primary,
    },
    keypadContainer: {
      width: "80%",
    },
    keypadRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 16,
    },
    keypadButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    keypadButtonText: {
      fontSize: 24,
      color: colors.text,
    },
    actionButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      justifyContent: "center",
      alignItems: "center",
    },
    timerText: {
      fontSize: 16,
      color: colors.notification,
      marginTop: 20,
    },
    hiddenInput: {
      position: "absolute",
      width: 0,
      height: 0,
      opacity: 0,
    },
  })

  return (
    <View style={styles.container}>
      <Lock size={64} color={colors.primary} style={styles.lockIcon} />
      <Text style={styles.title}>Enter PIN to Unlock</Text>

      <View style={styles.pinContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View key={index} style={[styles.pinDot, pin.length > index && styles.pinDotFilled]} />
        ))}
      </View>

      {isLocked ? (
        <Text style={styles.timerText}>Try again in {lockTimer} seconds</Text>
      ) : (
        <View style={styles.keypadContainer}>
          <View style={styles.keypadRow}>
            <TouchableOpacity style={styles.keypadButton} onPress={() => handlePinInput("1")}>
              <Text style={styles.keypadButtonText}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.keypadButton} onPress={() => handlePinInput("2")}>
              <Text style={styles.keypadButtonText}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.keypadButton} onPress={() => handlePinInput("3")}>
              <Text style={styles.keypadButtonText}>3</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.keypadRow}>
            <TouchableOpacity style={styles.keypadButton} onPress={() => handlePinInput("4")}>
              <Text style={styles.keypadButtonText}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.keypadButton} onPress={() => handlePinInput("5")}>
              <Text style={styles.keypadButtonText}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.keypadButton} onPress={() => handlePinInput("6")}>
              <Text style={styles.keypadButtonText}>6</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.keypadRow}>
            <TouchableOpacity style={styles.keypadButton} onPress={() => handlePinInput("7")}>
              <Text style={styles.keypadButtonText}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.keypadButton} onPress={() => handlePinInput("8")}>
              <Text style={styles.keypadButtonText}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.keypadButton} onPress={() => handlePinInput("9")}>
              <Text style={styles.keypadButtonText}>9</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.keypadRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleClear}>
              <Text style={styles.keypadButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.keypadButton} onPress={() => handlePinInput("0")}>
              <Text style={styles.keypadButtonText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {pin.length === 4 && (
            <TouchableOpacity
              style={[styles.keypadButton, { backgroundColor: colors.primary, alignSelf: "center", marginTop: 16 }]}
              onPress={handleUnlock}
            >
              <Text style={[styles.keypadButtonText, { color: "white" }]}>Unlock</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Hidden input for accessibility */}
      <TextInput
        style={styles.hiddenInput}
        value={pin}
        keyboardType="numeric"
        maxLength={4}
        secureTextEntry
        onChangeText={setPin}
      />
    </View>
  )
}

export default KeypadLock
