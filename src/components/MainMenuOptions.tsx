"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native"
import { useNavigation } from "@react-navigation/native"
import {
  Settings,
  MessageSquare,
  Users,
  HelpCircle,
  Info,
  LogOut,
  Archive,
  Moon,
  Lock,
  WifiOff,
  UserPlus,
} from "lucide-react-native"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"

interface MainMenuOptionsProps {
  isVisible: boolean
  onClose: () => void
}

const MainMenuOptions: React.FC<MainMenuOptionsProps> = ({ isVisible, onClose }) => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { logout } = useAuth()

  const handleNavigation = (screen: string, params?: any) => {
    onClose()
    navigation.navigate(screen as never, params as never)
  }

  const handleLogout = () => {
    onClose()
    logout()
  }

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    container: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 30, // Extra padding for bottom safe area
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
    },
    section: {
      marginVertical: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.primary,
      marginLeft: 16,
      marginTop: 8,
      marginBottom: 4,
      textTransform: "uppercase",
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    menuItemIcon: {
      marginRight: 16,
      width: 24,
      alignItems: "center",
    },
    menuItemText: {
      fontSize: 16,
      color: colors.text,
    },
    logoutItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    logoutText: {
      fontSize: 16,
      color: colors.notification,
    },
  })

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Menu</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: colors.primary }}>Close</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chats</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation("ChatRooms")}>
              <View style={styles.menuItemIcon}>
                <MessageSquare size={24} color={colors.primary} />
              </View>
              <Text style={styles.menuItemText}>All Chats</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation("GroupChatCreation")}>
              <View style={styles.menuItemIcon}>
                <Users size={24} color={colors.primary} />
              </View>
              <Text style={styles.menuItemText}>Create Group Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation("ChatInvitation")}>
              <View style={styles.menuItemIcon}>
                <UserPlus size={24} color={colors.primary} />
              </View>
              <Text style={styles.menuItemText}>Invite to Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation("StoredMessages")}>
              <View style={styles.menuItemIcon}>
                <Archive size={24} color={colors.primary} />
              </View>
              <Text style={styles.menuItemText}>Stored Messages</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation("SettingsMain")}>
              <View style={styles.menuItemIcon}>
                <Settings size={24} color={colors.primary} />
              </View>
              <Text style={styles.menuItemText}>All Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation("Themes")}>
              <View style={styles.menuItemIcon}>
                <Moon size={24} color={colors.primary} />
              </View>
              <Text style={styles.menuItemText}>Themes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation("Security")}>
              <View style={styles.menuItemIcon}>
                <Lock size={24} color={colors.primary} />
              </View>
              <Text style={styles.menuItemText}>Security</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation("OfflineSettings")}>
              <View style={styles.menuItemIcon}>
                <WifiOff size={24} color={colors.primary} />
              </View>
              <Text style={styles.menuItemText}>Offline Mode</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Help</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation("Help")}>
              <View style={styles.menuItemIcon}>
                <HelpCircle size={24} color={colors.primary} />
              </View>
              <Text style={styles.menuItemText}>Help & Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation("About")}>
              <View style={styles.menuItemIcon}>
                <Info size={24} color={colors.primary} />
              </View>
              <Text style={styles.menuItemText}>About UZZAP</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
            <View style={styles.menuItemIcon}>
              <LogOut size={24} color={colors.notification} />
            </View>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default MainMenuOptions
