"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { LogIn, Shield, AlertTriangle } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"
import { useSettings } from "../../context/SettingsContext"

const AutoLoginConfirmationScreen = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { settings, updateSettings } = useSettings()

  const [autoLogin, setAutoLogin] = useState(settings.autoLogin)

  const handleSaveSettings = async () => {
    try {
      await updateSettings({ autoLogin })

      Alert.alert("Settings Saved", `Auto login has been ${autoLogin ? "enabled" : "disabled"}`, [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    } catch (error) {
      console.error("Failed to save settings:", error)
      Alert.alert("Error", "Failed to save settings")
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
    section: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 24,
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    settingDescription: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
      marginTop: 4,
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
    securityTip: {
      backgroundColor: colors.primary + "20", // Add transparency
      borderRadius: 8,
      padding: 16,
      marginBottom: 24,
      flexDirection: "row",
      alignItems: "center",
    },
    securityIcon: {
      marginRight: 12,
    },
    securityText: {
      flex: 1,
      fontSize: 14,
      color: colors.primary,
    },
    saveButton: {
      backgroundColor: colors.primary,
      height: 50,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    saveButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LogIn size={64} color={colors.primary} style={styles.icon} />
        <Text style={styles.title}>Auto Login Settings</Text>
        <Text style={styles.subtitle}>Configure how UZZAP handles automatic login</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Enable Auto Login</Text>
            <Text style={styles.settingDescription}>Automatically log in when you open the app</Text>
          </View>
          <Switch
            value={autoLogin}
            onValueChange={setAutoLogin}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="white"
          />
        </View>
      </View>

      {autoLogin ? (
        <View style={styles.warningBox}>
          <AlertTriangle size={24} color={colors.notification} style={styles.warningIcon} />
          <Text style={styles.warningText}>
            Auto login is less secure. Anyone with access to your device can access your UZZAP account.
          </Text>
        </View>
      ) : (
        <View style={styles.securityTip}>
          <Shield size={24} color={colors.primary} style={styles.securityIcon} />
          <Text style={styles.securityText}>
            Good choice! Disabling auto login improves the security of your UZZAP account.
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AutoLoginConfirmationScreen
