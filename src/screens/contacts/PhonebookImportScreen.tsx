"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Check, Search, RefreshCw, UserPlus } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"
import { useContacts } from "../../context/ContactContext"

// Mock phonebook contacts
const mockPhonebookContacts = [
  { id: "pb1", name: "Alice Johnson", phoneNumber: "+1234567890" },
  { id: "pb2", name: "Bob Smith", phoneNumber: "+1987654321" },
  { id: "pb3", name: "Carol White", phoneNumber: "+11223344556" },
  { id: "pb4", name: "David Brown", phoneNumber: "+15556667777" },
  { id: "pb5", name: "Emma Davis", phoneNumber: "+19998887777" },
  { id: "pb6", name: "Frank Miller", phoneNumber: "+17773331111" },
  { id: "pb7", name: "Grace Wilson", phoneNumber: "+12223334444" },
  { id: "pb8", name: "Henry Taylor", phoneNumber: "+14445556666" },
]

const PhonebookImportScreen = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { contacts, addContact } = useContacts()

  const [phonebookContacts, setPhonebookContacts] = useState<typeof mockPhonebookContacts>([])
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isImporting, setIsImporting] = useState(false)

  useEffect(() => {
    // Simulate loading phonebook contacts
    const loadPhonebookContacts = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would use the Contacts API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Filter out contacts that are already in the app
        const existingPhoneNumbers = contacts.map((c) => c.phoneNumber)
        const filteredContacts = mockPhonebookContacts.filter((c) => !existingPhoneNumbers.includes(c.phoneNumber))

        setPhonebookContacts(filteredContacts)
      } catch (error) {
        console.error("Failed to load phonebook contacts:", error)
        Alert.alert("Error", "Failed to load phonebook contacts")
      } finally {
        setIsLoading(false)
      }
    }

    loadPhonebookContacts()
  }, [contacts])

  const handleToggleContact = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter((id) => id !== contactId))
    } else {
      setSelectedContacts([...selectedContacts, contactId])
    }
  }

  const handleImportContacts = async () => {
    if (selectedContacts.length === 0) {
      Alert.alert("Error", "Please select at least one contact to import")
      return
    }

    setIsImporting(true)
    try {
      // Import selected contacts
      for (const contactId of selectedContacts) {
        const contactToImport = phonebookContacts.find((c) => c.id === contactId)
        if (contactToImport) {
          await addContact({
            name: contactToImport.name,
            phoneNumber: contactToImport.phoneNumber,
            status: "offline",
            groups: [],
            isBlocked: false,
          })
        }
      }

      Alert.alert("Contacts Imported", `Successfully imported ${selectedContacts.length} contacts`, [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    } catch (error) {
      console.error("Failed to import contacts:", error)
      Alert.alert("Error", "Failed to import contacts")
    } finally {
      setIsImporting(false)
    }
  }

  const handleRefresh = () => {
    // Reload phonebook contacts
    setPhonebookContacts([])
    setSelectedContacts([])
    setIsLoading(true)

    // Simulate refreshing
    setTimeout(() => {
      setPhonebookContacts(mockPhonebookContacts)
      setIsLoading(false)
    }, 1000)
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
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
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
    importButton: {
      backgroundColor: colors.primary,
      height: 50,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
    },
    importButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 8,
    },
    refreshButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 12,
    },
    refreshButtonText: {
      color: colors.primary,
      fontSize: 16,
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
      marginBottom: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  })

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 16 }}>Loading contacts...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Import from Phonebook</Text>
        <Text style={styles.subtitle}>Select contacts from your phonebook to import into UZZAP</Text>

        <View style={styles.searchContainer}>
          <Search size={20} color={colors.text} />
          <Text style={styles.searchInput}>Search contacts</Text>
        </View>

        <Text style={styles.selectedCount}>{selectedContacts.length} contacts selected</Text>
      </View>

      {phonebookContacts.length > 0 ? (
        <FlatList
          data={phonebookContacts}
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
            No new contacts found in your phonebook or all contacts have already been imported.
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <RefreshCw size={20} color={colors.primary} />
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.importButton}
          onPress={handleImportContacts}
          disabled={isImporting || selectedContacts.length === 0}
        >
          {isImporting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <UserPlus size={20} color="white" />
              <Text style={styles.importButtonText}>Import {selectedContacts.length} Contacts</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh} disabled={isImporting}>
          <RefreshCw size={20} color={colors.primary} />
          <Text style={styles.refreshButtonText}>Refresh Contacts</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default PhonebookImportScreen
