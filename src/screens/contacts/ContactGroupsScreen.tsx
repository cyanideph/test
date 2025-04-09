"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Modal } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Users, Plus, Edit2, Trash2, ChevronRight } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"
import { useContacts } from "../../context/ContactContext"

const ContactGroupsScreen = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { contactGroups, addContactGroup, updateContactGroup, deleteContactGroup } = useContacts()

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null)

  const handleAddGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Error", "Please enter a group name")
      return
    }

    try {
      await addContactGroup(groupName.trim())
      setGroupName("")
      setShowAddModal(false)
      Alert.alert("Success", "Group created successfully")
    } catch (error) {
      console.error("Failed to create group:", error)
      Alert.alert("Error", "Failed to create group")
    }
  }

  const handleEditGroup = async () => {
    if (!groupName.trim() || !editingGroupId) {
      Alert.alert("Error", "Please enter a group name")
      return
    }

    try {
      await updateContactGroup(editingGroupId, { name: groupName.trim() })
      setGroupName("")
      setEditingGroupId(null)
      setShowEditModal(false)
      Alert.alert("Success", "Group updated successfully")
    } catch (error) {
      console.error("Failed to update group:", error)
      Alert.alert("Error", "Failed to update group")
    }
  }

  const handleDeleteGroup = (groupId: string, groupName: string) => {
    Alert.alert(
      "Delete Group",
      `Are you sure you want to delete the group "${groupName}"? This will not delete the contacts in the group.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteContactGroup(groupId)
              Alert.alert("Success", "Group deleted successfully")
            } catch (error) {
              console.error("Failed to delete group:", error)
              Alert.alert("Error", "Failed to delete group")
            }
          },
        },
      ],
    )
  }

  const openEditModal = (group: { id: string; name: string }) => {
    setEditingGroupId(group.id)
    setGroupName(group.name)
    setShowEditModal(true)
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
    },
    addButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    groupItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    groupIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.secondary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    groupInfo: {
      flex: 1,
    },
    groupName: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    groupCount: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
    },
    actionButtons: {
      flexDirection: "row",
    },
    actionButton: {
      padding: 8,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      width: "80%",
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 16,
    },
    modalTitle: {
      fontSize: 18,
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
    modalButtons: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    modalButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 4,
      marginLeft: 8,
    },
    cancelButton: {
      backgroundColor: colors.border,
    },
    saveButton: {
      backgroundColor: colors.primary,
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
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
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contact Groups</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setGroupName("")
            setShowAddModal(true)
          }}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      {contactGroups.length > 0 ? (
        <FlatList
          data={contactGroups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.groupItem}
              onPress={() =>
                navigation.navigate("GroupContacts" as never, { groupId: item.id, groupName: item.name } as never)
              }
            >
              <View style={styles.groupIcon}>
                <Users size={20} color="white" />
              </View>

              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{item.name}</Text>
                <Text style={styles.groupCount}>{item.contacts.length} contacts</Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton} onPress={() => openEditModal(item)}>
                  <Edit2 size={20} color={colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteGroup(item.id, item.name)}>
                  <Trash2 size={20} color={colors.notification} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                  <ChevronRight size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            You don't have any contact groups yet. Create a group to organize your contacts.
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { marginTop: 16 }]}
            onPress={() => {
              setGroupName("")
              setShowAddModal(true)
            }}
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Add Group Modal */}
      <Modal visible={showAddModal} transparent animationType="fade" onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Group</Text>

            <TextInput
              style={styles.input}
              placeholder="Group Name"
              placeholderTextColor="#94a3b8"
              value={groupName}
              onChangeText={setGroupName}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleAddGroup}>
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Group Modal */}
      <Modal visible={showEditModal} transparent animationType="fade" onRequestClose={() => setShowEditModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Group</Text>

            <TextInput
              style={styles.input}
              placeholder="Group Name"
              placeholderTextColor="#94a3b8"
              value={groupName}
              onChangeText={setGroupName}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleEditGroup}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ContactGroupsScreen
