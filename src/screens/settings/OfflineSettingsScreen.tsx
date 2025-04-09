"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { WifiOff, Download, Database, RefreshCw } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"
import { useSettings } from "../../context/SettingsContext"

const OfflineSettingsScreen = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { settings, updateSettings } = useSettings()
  const [syncing, setSyncing] = useState(false)

  const handleToggleOfflineMode = async (value: boolean) => {
    try {
      await updateSettings({ offlineMode: value })
      if (value) {
        Alert.alert(
          "Offline Mode Enabled",
          "You are now in offline mode. You can still view your messages, but you won't receive new ones until you go back online.",
        )
      } else {
        setSyncing(true)
        // Simulate syncing
        setTimeout(() => {
          setSyncing(false)
          Alert.alert("Sync Complete", "Your messages have been synchronized with the server.")
        }, 2000)
      }
    } catch (error) {
      console.error("Failed to toggle offline mode:", error)
      Alert.alert("Error", "Failed to change offline mode settings")
    }
  }

  const handleSyncNow = () => {
    setSyncing(true)
    // Simulate syncing
    setTimeout(() => {
      setSyncing(false)
      Alert.alert("Sync Complete", "Your messages have been synchronized with the server.")
    }, 2000)
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
    syncButton: {
      backgroundColor: colors.primary,
      height: 50,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 16,
      marginTop: 20,
      flexDirection: "row",
    },
    syncButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 8,
    },
    statusContainer: {
      padding: 16,
      backgroundColor: colors.card,
      borderRadius: 8,
      marginHorizontal: 16,
      marginTop: 20,
    },
    statusTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    statusText: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
    },
    lastSyncText: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.5,
      marginTop: 8,
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Offline Settings</Text>
        <View>
          <View style={[styles.item, styles.itemFirst]}>
            <View style={styles.itemIcon}>
              <WifiOff size={20} color={colors.primary} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Offline Mode</Text>
              <Text style={styles.itemDescription}>Use the app without an internet connection</Text>
            </View>
            <Switch
              value={settings.offlineMode}
              onValueChange={handleToggleOfflineMode}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="white"
            />
          </View>

          <View style={styles.item}>
            <View style={styles.itemIcon}>
              <Download size={20} color={colors.primary} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Download Messages</Text>
              <Text style={styles.itemDescription}>Store messages for offline access</Text>
            </View>
            <Switch value={true} trackColor={{ false: colors.border, true: colors.primary }} thumbColor="white" />
          </View>

          <View style={[styles.item, styles.itemLast]}>
            <View style={styles.itemIcon}>
              <Database size={20} color={colors.primary} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Storage Usage</Text>
              <Text style={styles.itemDescription}>12.5 MB used for offline data</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.syncButton} onPress={handleSyncNow} disabled={syncing}>
        <RefreshCw size={20} color="white" />
        <Text style={styles.syncButtonText}>{syncing ? "Syncing..." : "Sync Now"}</Text>
      </TouchableOpacity>

      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Sync Status</Text>
        <Text style={styles.statusText}>
          {settings.offlineMode
            ? "You are currently in offline mode. Your changes will be synchronized when you go back online."
            : "You are online. All your messages are up to date."}
        </Text>
        <Text style={styles.lastSyncText}>Last synced: {new Date().toLocaleString()}</Text>
      </View>
    </View>
  )
}

export default OfflineSettingsScreen
