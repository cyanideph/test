"use client"
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native"
import { Check } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"

const themes = [
  { id: "default", name: "Default", description: "The standard UZZAP theme" },
  { id: "black", name: "Dark Mode", description: "Easy on the eyes, especially at night" },
  { id: "dolphins", name: "Dolphins", description: "Calm blue theme inspired by the ocean" },
  { id: "hearts", name: "Hearts", description: "Pink theme with a touch of romance" },
  { id: "roses", name: "Roses", description: "Bold red theme inspired by roses" },
  { id: "uzzap", name: "UZZAP", description: "The classic UZZAP theme" },
]

const ThemesScreen = () => {
  const { theme: currentTheme, changeTheme, colors } = useTheme()

  const renderThemePreview = (themeId) => {
    // In a real app, you would show an actual preview of the theme
    // For now, we'll just show a colored circle
    let previewColor
    switch (themeId) {
      case "default":
        previewColor = "#6366f1"
        break
      case "black":
        previewColor = "#3b82f6"
        break
      case "dolphins":
        previewColor = "#0ea5e9"
        break
      case "hearts":
        previewColor = "#ec4899"
        break
      case "roses":
        previewColor = "#f43f5e"
        break
      case "uzzap":
        previewColor = "#8b5cf6"
        break
      default:
        previewColor = "#6366f1"
    }

    return <View style={[styles.themePreview, { backgroundColor: previewColor }]} />
  }

  const renderThemeItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.themeItem, currentTheme === item.id && { backgroundColor: colors.card }]}
      onPress={() => changeTheme(item.id)}
    >
      {renderThemePreview(item.id)}
      <View style={styles.themeInfo}>
        <Text style={[styles.themeName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.themeDescription, { color: colors.text }]}>{item.description}</Text>
      </View>
      {currentTheme === item.id && (
        <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
          <Check size={16} color="white" />
        </View>
      )}
    </TouchableOpacity>
  )

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    themeItem: {
      flexDirection: "row",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      alignItems: "center",
    },
    themePreview: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 16,
    },
    themeInfo: {
      flex: 1,
    },
    themeName: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 4,
    },
    themeDescription: {
      fontSize: 14,
      opacity: 0.7,
    },
    checkmark: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
  })

  return (
    <View style={styles.container}>
      <FlatList data={themes} keyExtractor={(item) => item.id} renderItem={renderThemeItem} />
    </View>
  )
}

export default ThemesScreen
