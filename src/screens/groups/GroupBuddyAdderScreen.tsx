"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Search, Check, X, UserPlus } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"
import { useContacts } from "../../context/ContactContext"
import { useChat } from "../../context/ChatContext"

const GroupBuddyAdderScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { colors } = useTheme()
  const { contacts } = useContacts()
  const { getChatRoom, addParticipantToGroup } = useChat()

  const { roomId } = route.params as { roomId: string }
  const chatRoom = getChatRoom(roomId)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [isAdding, setIsAdding] = useState(false)

  // Filter out contacts that are already in the group
  const availableContacts = contacts.filter(
    (contact) => !chatRoom?.participants.includes(contact.id) && !selectedContacts.includes(contact.id),
  )

  const filteredContacts = availableContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || contact.phoneNumber.includes(searchQuery),
  )

  const handleToggleContact = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter((id) => id !== contactId))
    } else {
      setSelectedContacts([...selectedContacts, contactId])
    }
  }

  const handleAddToGroup = async () => {
    if (selectedContacts.length === 0) {
      Alert.alert("Error", "Please select at least one contact to add to the group")
      return
    }

    setIsAdding(true)
    try {
      // Add selected contacts to the group
      for (const contactId of selectedContacts) {
        await addParticipantToGroup(roomId, contactId)
      }

      Alert.alert("Success", `Added ${selectedContacts.length} contacts to the group`, [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    } catch (error) {
      console.error("Failed to add contacts to group:", error)
      Alert.alert("Error", "Failed to add contacts to group")
    } finally {
      setIsAdding(false)
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 16,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchInput: {
      flex: 1,
      height: 50,
      color: colors.text,
    },
    clearButton: {
      padding: 8,
    },
    selectedCount: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    contactAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.secondary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    avatarText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    contactInfo: {
      flex: 1,
    },
    contactName: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    contactPhone: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
    },
    checkBox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    checkBoxSelected: {
      backgroundColor: colors.primary,
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    addButton: {
      backgroundColor: colors.primary,
      height: 50,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
    },
    addButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 8,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    emptyText: {
      fontSize: 16,
      color: colors.text,
      opacity: 0.7,
      textAlign: "center",
    },
  })

  if (!chatRoom) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.text }}>Group not found</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Members to {chatRoom.name}</Text>

        <View style={styles.searchContainer}>
          <Search size={20} color={colors.text} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts"
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery("")}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.selectedCount}>{selectedContacts.length} contacts selected</Text>
      </View>

      {filteredContacts.length > 0 ? (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.contactItem} onPress={() => handleToggleContact(item.id)}>
              <View style={styles.contactAvatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
              </View>

              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
              </View>

              <View style={[styles.checkBox, selectedContacts.includes(item.id) && styles.checkBoxSelected]}>
                {selectedContacts.includes(item.id) && <Check size={16} color="white" />}
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {availableContacts.length === 0
              ? "All your contacts are already in this group."
              : "No contacts found matching your search."}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddToGroup}
          disabled={isAdding || selectedContacts.length === 0}
        >
          {isAdding ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <UserPlus size={20} color="white" />
              <Text style={styles.addButtonText}>Add to Group</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default GroupBuddyAdderScreen
