"use client"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { HelpCircle, MessageCircle, Users, Settings, Bell, Lock, WifiOff, ChevronRight } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"

const HelpScreen = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()

  const helpTopics = [
    {
      id: "messaging",
      title: "Messaging",
      icon: <MessageCircle size={20} color={colors.primary} />,
      topics: ["How to send messages", "Sending photos and audio", "Using emoticons", "Deleting messages"],
    },
    {
      id: "groups",
      title: "Group Chats",
      icon: <Users size={20} color={colors.primary} />,
      topics: ["Creating group chats", "Adding members to groups", "Group admin features", "Leaving a group"],
    },
    {
      id: "settings",
      title: "Settings",
      icon: <Settings size={20} color={colors.primary} />,
      topics: ["Changing your theme", "Profile settings", "Privacy options"],
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: <Bell size={20} color={colors.primary} />,
      topics: ["Message notifications", "Group notifications", "Muting conversations"],
    },
    {
      id: "security",
      title: "Security",
      icon: <Lock size={20} color={colors.primary} />,
      topics: ["Setting up keypad lock", "Changing your PIN", "Privacy settings"],
    },
    {
      id: "offline",
      title: "Offline Mode",
      icon: <WifiOff size={20} color={colors.primary} />,
      topics: ["Using the app offline", "Syncing messages", "Managing storage"],
    },
  ]

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
    },
    headerIcon: {
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
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
    topicContainer: {
      backgroundColor: colors.card,
      borderRadius: 8,
      marginHorizontal: 16,
      marginBottom: 16,
      overflow: "hidden",
    },
    topicHeader: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    topicTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginLeft: 12,
    },
    topicItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    topicItemText: {
      fontSize: 16,
      color: colors.text,
    },
    contactSupport: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      marginHorizontal: 16,
      marginTop: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    contactSupportText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 8,
    },
    faqTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginHorizontal: 16,
      marginTop: 20,
      marginBottom: 12,
    },
    faqItem: {
      backgroundColor: colors.card,
      borderRadius: 8,
      marginHorizontal: 16,
      marginBottom: 12,
      padding: 16,
    },
    faqQuestion: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    faqAnswer: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.8,
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HelpCircle size={24} color={colors.primary} style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      <ScrollView>
        <Text style={styles.sectionTitle}>Help Topics</Text>

        {helpTopics.map((topic) => (
          <View key={topic.id} style={styles.topicContainer}>
            <View style={styles.topicHeader}>
              {topic.icon}
              <Text style={styles.topicTitle}>{topic.title}</Text>
            </View>

            {topic.topics.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.topicItem, index === topic.topics.length - 1 && { borderBottomWidth: 0 }]}
              >
                <Text style={styles.topicItemText}>{item}</Text>
                <ChevronRight size={20} color={colors.text} />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <Text style={styles.faqTitle}>Frequently Asked Questions</Text>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>How do I create a group chat?</Text>
          <Text style={styles.faqAnswer}>
            To create a group chat, go to the Chats tab, tap the + button, and select "New Group Chat". Then enter a
            group name and select the contacts you want to add.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Can I use UZZAP without an internet connection?</Text>
          <Text style={styles.faqAnswer}>
            Yes, you can use UZZAP in offline mode. Go to Settings > Offline Settings and enable "Offline Mode". You'll
            be able to view your downloaded messages, but you won't receive new ones until you go back online.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>How do I change my theme?</Text>
          <Text style={styles.faqAnswer}>
            To change your theme, go to Settings > Theme. You can choose from several pre-designed themes including
            Default, Dark Mode, Dolphins, Hearts, Roses, and UZZAP.
          </Text>
        </View>

        <TouchableOpacity style={styles.contactSupport}>
          <MessageCircle size={20} color="white" />
          <Text style={styles.contactSupportText}>Contact Support</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

export default HelpScreen
