"use client"

import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Palette, Bell, Lock, HelpCircle, Info, LogOut, ChevronRight, User, MessageSquare } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"

const SettingsScreen = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { user, logout, updateStatus } = useAuth()
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true)
  const [autoLogin, setAutoLogin] = React.useState(true)

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => logout(),
      },
    ])
  }

  const handleStatusChange = (status) => {
    updateStatus(status)
    Alert.alert("Status Updated", `Your status is now set to ${status}`)
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
    itemValue: {
      fontSize: 16,
      color: colors.text,
      opacity: 0.7,
    },
    itemRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    chevron: {
      marginLeft: 4,
    },
    statusContainer: {
      flexDirection: "row",
      marginTop: 8,
    },
    statusOption: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 16,
    },
    statusDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 4,
    },
    statusText: {
      fontSize: 14,
      color: colors.text,
    },
    logoutButton: {
      marginTop: 20,
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    logoutText: {
      color: "#ef4444",
    },
    version: {
      textAlign: "center",
      marginTop: 20,
      marginBottom: 20,
      fontSize: 12,
      color: colors.text,
      opacity: 0.5,
    },
  })

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <View>
          <TouchableOpacity style={[styles.item, styles.itemFirst]}>
            <View style={styles.itemIcon}>
              <User size={20} color={colors.primary} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Account</Text>
              <Text style={styles.itemValue}>{user?.username}</Text>
            </View>
            <View style={styles.itemRight}>
              <ChevronRight size={20} color={colors.text} style={styles.chevron} />
            </View>
          </TouchableOpacity>

          <View style={styles.item}>
            <View style={styles.itemIcon}>
              <MessageSquare size={20} color={colors.primary} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Status</Text>
              <View style={styles.statusContainer}>
                <TouchableOpacity style={styles.statusOption} onPress={() => handleStatusChange("online")}>
                  <View style={[styles.statusDot, { backgroundColor: colors.online }]} />
                  <Text
                    style={[
                      styles.statusText,
                      user?.status === "online" && { fontWeight: "bold", color: colors.primary },
                    ]}
                  >
                    Online
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.statusOption} onPress={() => handleStatusChange("away")}>
                  <View style={[styles.statusDot, { backgroundColor: colors.away }]} />
                  <Text
                    style={[
                      styles.statusText,
                      user?.status === "away" && { fontWeight: "bold", color: colors.primary },
                    ]}
                  >
                    Away
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.statusOption} onPress={() => handleStatusChange("offline")}>
                  <View style={[styles.statusDot, { backgroundColor: colors.offline }]} />
                  <Text
                    style={[
                      styles.statusText,
                      user?.status === "offline" && { fontWeight: "bold", color: colors.primary },
                    ]}
                  >
                    Offline
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Appearance Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View>
          <TouchableOpacity
            style={[styles.item, styles.itemFirst, styles.itemLast]}
            onPress={() => navigation.navigate("Themes" as never)}
          >
            <View style={styles.itemIcon}>
              <Palette size={20} color={colors.primary} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Theme</Text>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemValue}>
                {user?.theme ? user.theme.charAt(0).toUpperCase() + user.theme.slice(1) : "Default"}
              </Text>
              <ChevronRight size={20} color={colors.text} style={styles.chevron} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View>
          <View style={[styles.item, styles.itemFirst]}>
            <View style={styles.itemIcon}>
              <Bell size={20} color={colors.primary} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="white"
            />
          </View>

          <View style={[styles.item, styles.itemLast]}>
            <View style={styles.itemIcon}>
              <Lock size={20} color={colors.primary} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Auto Login</Text>
            </View>
            <Switch
              value={autoLogin}
              onValueChange={setAutoLogin}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="white"
            />
          </View>
        </View>
      </View>

      {/* Help & About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Help & About</Text>
        <View>
          <TouchableOpacity style={[styles.item, styles.itemFirst]}>
            <View style={styles.itemIcon}>
              <HelpCircle size={20} color={colors.primary} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Help</Text>
            </View>
            <View style={styles.itemRight}>
              <ChevronRight size={20} color={colors.text} style={styles.chevron} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.item, styles.itemLast]}>
            <View style={styles.itemIcon}>
              <Info size={20} color={colors.primary} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>About</Text>
            </View>
            <View style={styles.itemRight}>
              <ChevronRight size={20} color={colors.text} style={styles.chevron} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={[styles.item, styles.logoutButton]} onPress={handleLogout}>
        <View style={styles.itemIcon}>
          <LogOut size={20} color="#ef4444" />
        </View>
        <View style={styles.itemContent}>
          <Text style={[styles.itemTitle, styles.logoutText]}>Logout</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.version}>UZZAP Chat v1.0.0</Text>
    </ScrollView>
  )
}

export default SettingsScreen
