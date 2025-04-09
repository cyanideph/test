"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal } from "react-native"
import { X } from "lucide-react-native"
import { useTheme } from "../context/ThemeContext"
import { emoticonCategories } from "../data/emoticons"

interface EmoticonPickerProps {
  isVisible: boolean
  onClose: () => void
  onSelect: (emoticon: string) => void
}

const EmoticonPicker: React.FC<EmoticonPickerProps> = ({ isVisible, onClose, onSelect }) => {
  const { colors } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState(emoticonCategories[0].id)

  const currentCategory = emoticonCategories.find((cat) => cat.id === selectedCategory) || emoticonCategories[0]

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    container: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: "60%",
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
    closeButton: {
      padding: 4,
    },
    categoriesContainer: {
      flexDirection: "row",
      padding: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    categoryButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginHorizontal: 4,
      borderRadius: 16,
    },
    selectedCategoryButton: {
      backgroundColor: colors.primary,
    },
    categoryText: {
      color: colors.text,
      fontSize: 14,
    },
    selectedCategoryText: {
      color: "white",
      fontWeight: "bold",
    },
    emoticonGrid: {
      padding: 8,
    },
    emoticonButton: {
      width: 50,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      margin: 4,
      borderRadius: 8,
      backgroundColor: colors.card,
    },
    emoticonText: {
      fontSize: 24,
    },
  })

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Emoticons</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            data={emoticonCategories}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.categoryButton, selectedCategory === item.id && styles.selectedCategoryButton]}
                onPress={() => setSelectedCategory(item.id)}
              >
                <Text style={[styles.categoryText, selectedCategory === item.id && styles.selectedCategoryText]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />

          <FlatList
            data={currentCategory.emoticons}
            keyExtractor={(item) => item.id}
            numColumns={6}
            contentContainerStyle={styles.emoticonGrid}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.emoticonButton}
                onPress={() => {
                  onSelect(item.emoji)
                  onClose()
                }}
              >
                <Text style={styles.emoticonText}>{item.emoji}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  )
}

export default EmoticonPicker
