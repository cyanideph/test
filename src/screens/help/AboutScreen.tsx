"use client"
import { View, Text, StyleSheet, ScrollView, Image, Linking, TouchableOpacity } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { Globe, Mail, Twitter, Facebook, Instagram } from "lucide-react-native"

const AboutScreen = () => {
  const { colors } = useTheme()

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't open link", err))
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 30,
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: 16,
    },
    appName: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 4,
    },
    version: {
      fontSize: 16,
      color: colors.text,
      opacity: 0.7,
      marginBottom: 8,
    },
    tagline: {
      fontSize: 16,
      color: colors.text,
      textAlign: "center",
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
    },
    paragraph: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 22,
      marginBottom: 16,
    },
    socialLinks: {
      flexDirection: "row",
      justifyContent: "center",
      marginVertical: 20,
    },
    socialButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 8,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    contactText: {
      fontSize: 14,
      color: colors.text,
      marginLeft: 12,
    },
    linkText: {
      color: colors.primary,
      textDecorationLine: "underline",
    },
    footer: {
      marginTop: 30,
      marginBottom: 20,
      alignItems: "center",
    },
    copyright: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.7,
      textAlign: "center",
    },
  })

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image source={{ uri: "/placeholder.svg?height=120&width=120" }} style={styles.logo} />
          <Text style={styles.appName}>UZZAP Chat</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.tagline}>Connect with friends and family instantly</Text>
        </View>

        <Text style={styles.sectionTitle}>About UZZAP</Text>
        <Text style={styles.paragraph}>
          UZZAP is a modern messaging app designed to help you stay connected with the people who matter most. With
          features like instant messaging, group chats, voice messages, and more, UZZAP makes communication simple,
          secure, and fun.
        </Text>
        <Text style={styles.paragraph}>
          Our mission is to provide a reliable and user-friendly platform for people to connect, share, and communicate
          across distances. We believe in creating technology that brings people together.
        </Text>

        <Text style={styles.sectionTitle}>Features</Text>
        <Text style={styles.paragraph}>
          • Instant messaging with friends and family{"\n"}• Create and manage group chats{"\n"}• Send voice messages
          and photos{"\n"}• Express yourself with emoticons{"\n"}• Multiple theme options{"\n"}• Offline mode for when
          you're on the go{"\n"}• Secure messaging with keypad lock
        </Text>

        <View style={styles.socialLinks}>
          <TouchableOpacity style={styles.socialButton} onPress={() => handleOpenLink("https://facebook.com")}>
            <Facebook size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={() => handleOpenLink("https://twitter.com")}>
            <Twitter size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={() => handleOpenLink("https://instagram.com")}>
            <Instagram size={20} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.contactItem}>
          <Globe size={20} color={colors.primary} />
          <Text style={styles.contactText}>
            Website:{" "}
            <Text style={styles.linkText} onPress={() => handleOpenLink("https://uzzap.com")}>
              www.uzzap.com
            </Text>
          </Text>
        </View>
        <View style={styles.contactItem}>
          <Mail size={20} color={colors.primary} />
          <Text style={styles.contactText}>
            Email:{" "}
            <Text style={styles.linkText} onPress={() => handleOpenLink("mailto:support@uzzap.com")}>
              support@uzzap.com
            </Text>
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.copyright}>
            © {new Date().getFullYear()} UZZAP Chat. All rights reserved.{"\n"}
            Privacy Policy | Terms of Service
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default AboutScreen
