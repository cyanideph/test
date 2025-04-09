"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Switch, TouchableOpacity, TextInput, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Lock, Key, Shield, ChevronRight } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"
import { useSettings } from "../../context/SettingsContext"

const SecuritySettingsScreen = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { settings, updateSettings } = useSettings()
  const [showPinSetup, setShowPinSetup] = useState(false)
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")

  const handleToggleKeypadLock = (value: boolean) => {
    if (value) {
      setShowPinSetup(true)
    } else {
      updateSettings({ keypadLock: false, keypadLockPin: "" })
    }
  }

  const handleSavePin = () => {
    if (pin.length < 4) {
      Alert.alert("Invalid PIN", "PIN must be at least 4 digits")
      return
    }

    if (pin !== confirmPin) {
      Alert.alert("PIN Mismatch", "PINs do not match. Please try again.")
      return
    }

    updateSettings({ keypadLock: true, keypadLockPin: pin })
    setShowPinSetup(false)
    setPin("")
    setConfirmPin("")
    Alert.alert("Success", "Keypad lock has been enabled")
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.primary,
      marginLeft: 16,
      marginTop: 16,
      marginBottom: 8,
      textTransform: "uppercase",
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    itemFirst: {
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    itemLast: {
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
    itemIcon: {
      marginRight: 12,
      width: 24,
      alignItems: "center",
    },
    itemContent: {
      flex: 1,
    },
    itemTitle: {
      fontSize: 16,
      color: colors.text,
    },
    itemDescription: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
      marginTop: 2,
    },
    pinSetupContainer: {
      padding: 16,
      backgroundColor: colors.card,
      borderRadius: 8,
      marginHorizontal: 16,
      marginTop: 16,
    },
    pinSetupTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 16,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      marginBottom: 16,
      paddingHorizontal: 12,
      backgroundColor: colors.background,
      color: colors.text,
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
    cancelButton: {
      backgroundColor: colors.notification,
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Security</Text>
        <View>
          <View style={[styles.item, styles.itemFirst]}>
            <View style={styles.itemIcon}>
              <Lock size={20} color={colors.primary} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Keypad Lock</Text>
              <Text style={styles.itemDescription}>Lock the app with a PIN code</Text>
            </View>
            <Switch
              value={settings.keypadLock}
              onValueChange={handleToggleKeypadLock}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="white"
            />
          </View>

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemIcon}>
              <Key size={20} color={colors.primary} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Change PIN</Text>
              <Text style={styles.itemDescription}>Change your keypad lock PIN</Text>
            </View>
            <ChevronRight size={20} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.item, styles.itemLast]}>
            <View style={styles.itemIcon}>
              <Shield size={20} color={colors.primary} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Privacy Settings</Text>
              <Text style={styles.itemDescription}>Manage your privacy preferences</Text>
            </View>
            <ChevronRight size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {showPinSetup && (
        <View style={styles.pinSetupContainer}>
          <Text style={styles.pinSetupTitle}>Set PIN Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter PIN (min 4 digits)"
            placeholderTextColor="#94a3b8"
            value={pin}
            onChangeText={setPin}
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm PIN"
            placeholderTextColor="#94a3b8"
            value={confirmPin}
            onChangeText={setConfirmPin}
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
          />
          <TouchableOpacity style={styles.button} onPress={handleSavePin}>
            <Text style={styles.buttonText}>Save PIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton, { marginTop: 8 }]}
            onPress={() => setShowPinSetup(false)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default SecuritySettingsScreen
