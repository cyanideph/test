"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Users, Check, Search, X } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"
import { useContacts } from "../../context/ContactContext"
import { useChat } from "../../context/ChatContext"

const GroupChatCreationScreen = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { contacts } = useContacts()
  const { createChatRoom } = useChat()

  const [groupName, setGroupName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [isCreating, setIsCreating] = useState(false)

  const filteredContacts = contacts.filter(
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

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Error", "Please enter a group name")
      return
    }

    if (selectedContacts.length < 1) {
      Alert.alert("Error", "Please select at least one contact")
      return
    }

    setIsCreating(true)
    try {
      const roomId = await createChatRoom(groupName.trim(), selectedContacts, true)

      Alert.alert("Success", "Group chat created successfully", [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("Chat" as never, { roomId, name: groupName.trim() } as never)
          },
        },
      ])
    } catch (error) {
      console.error("Failed to create group chat:", error)
      Alert.alert("Error", "Failed to create group chat")
    } finally {
      setIsCreating(false)
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
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      backgroundColor: colors.card,
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
      marginBottom: 8,
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
    createButton: {
      backgroundColor: colors.primary,
      height: 50,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      margin: 16,
      flexDirection: "row",
    },
    createButtonText: {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Group Chat</Text>

        <TextInput
          style={styles.input}
          placeholder="Group Name"
          placeholderTextColor="#94a3b8"
          value={groupName}
          onChangeText={setGroupName}
        />

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

      {contacts.length > 0 ? (
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
          <Text style={styles.emptyText}>You don't have any contacts yet. Add contacts to create a group chat.</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateGroup}
        disabled={isCreating || !groupName.trim() || selectedContacts.length === 0}
      >
        {isCreating ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Users size={20} color="white" />
            <Text style={styles.createButtonText}>Create Group</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default GroupChatCreationScreen
