"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "../utils/supabaseClient"
import type { Contact, ContactGroup } from "../models/types"
import { useAuth } from "./AuthContext"

interface ContactContextType {
  contacts: Contact[]
  contactGroups: ContactGroup[]
  addContact: (contact: Omit<Contact, "id">) => Promise<string>
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>
  deleteContact: (id: string) => Promise<void>
  getContact: (id: string) => Contact | undefined
  addContactGroup: (name: string) => Promise<string>
  updateContactGroup: (id: string, updates: Partial<ContactGroup>) => Promise<void>
  deleteContactGroup: (id: string) => Promise<void>
  addContactToGroup: (contactId: string, groupId: string) => Promise<void>
  removeContactFromGroup: (contactId: string, groupId: string) => Promise<void>
  getContactsInGroup: (groupId: string) => Contact[]
  importContactsFromPhonebook: () => Promise<number>
}

const ContactContext = createContext<ContactContextType | undefined>(undefined)

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [contactGroups, setContactGroups] = useState<ContactGroup[]>([])

  useEffect(() => {
    // Load contacts and groups from Supabase
    const loadData = async () => {
      if (!user) return

      try {
        // Load contacts
        const { data: contactsData, error: contactsError } = await supabase
          .from("contacts")
          .select(`
           id,
           contact_id,
           name,
           is_blocked,
           notes,
           users:contact_id (phone_number, status)
         `)
          .eq("user_id", user.id)

        if (contactsError) {
          console.error("Failed to load contacts:", contactsError)
          return
        }

        // Load contact groups
        const { data: groupsData, error: groupsError } = await supabase
          .from("contact_groups")
          .select("*")
          .eq("user_id", user.id)

        if (groupsError) {
          console.error("Failed to load contact groups:", groupsError)
          return
        }

        // Load group members
        const { data: groupMembersData, error: groupMembersError } = await supabase
          .from("contact_group_members")
          .select(`
           group_id,
           contact_id
         `)
          .in(
            "group_id",
            groupsData.map((g) => g.id),
          )

        if (groupMembersError && groupsData.length > 0) {
          console.error("Failed to load group members:", groupMembersError)
        }

        // Format contacts
        const formattedContacts: Contact[] = contactsData.map((contact) => ({
          id: contact.contact_id,
          name: contact.name,
          phoneNumber: contact.users?.phone_number || "",
          status: contact.users?.status || "offline",
          groups: groupMembersData?.filter((gm) => gm.contact_id === contact.id).map((gm) => gm.group_id) || [],
          isBlocked: contact.is_blocked,
          notes: contact.notes,
        }))

        // Format groups
        const formattedGroups: ContactGroup[] = groupsData.map((group) => ({
          id: group.id,
          name: group.name,
          contacts: groupMembersData?.filter((gm) => gm.group_id === group.id).map((gm) => gm.contact_id) || [],
        }))

        setContacts(formattedContacts)
        setContactGroups(formattedGroups)
      } catch (error) {
        console.error("Failed to load contacts data:", error)
      }
    }

    loadData()
  }, [user])

  const addContact = async (contact: Omit<Contact, "id">): Promise<string> => {
    if (!user) throw new Error("User not authenticated")

    try {
      // Check if user exists in the system
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("phone_number", contact.phoneNumber)
        .single()

      if (userError) {
        // User doesn't exist, create a placeholder user
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert([
            {
              username: contact.name,
              phone_number: contact.phoneNumber,
              status: "offline",
            },
          ])
          .select()

        if (createError) throw createError

        // Add contact with the new user ID
        const { data: newContact, error: contactError } = await supabase
          .from("contacts")
          .insert([
            {
              user_id: user.id,
              contact_id: newUser[0].id,
              name: contact.name,
              is_blocked: contact.isBlocked || false,
              notes: contact.notes,
            },
          ])
          .select()

        if (contactError) throw contactError

        // Add to local state
        const newContactObj: Contact = {
          id: newUser[0].id,
          name: contact.name,
          phoneNumber: contact.phoneNumber,
          status: "offline",
          groups: contact.groups || [],
          isBlocked: contact.isBlocked || false,
          notes: contact.notes,
        }

        setContacts((prevContacts) => [...prevContacts, newContactObj])

        return newUser[0].id
      } else {
        // User exists, add as contact
        const { data: newContact, error: contactError } = await supabase
          .from("contacts")
          .insert([
            {
              user_id: user.id,
              contact_id: userData.id,
              name: contact.name,
              is_blocked: contact.isBlocked || false,
              notes: contact.notes,
            },
          ])
          .select()

        if (contactError) throw contactError

        // Add to local state
        const newContactObj: Contact = {
          id: userData.id,
          name: contact.name,
          phoneNumber: contact.phoneNumber,
          status: "offline",
          groups: contact.groups || [],
          isBlocked: contact.isBlocked || false,
          notes: contact.notes,
        }

        setContacts((prevContacts) => [...prevContacts, newContactObj])

        return userData.id
      }
    } catch (error) {
      console.error("Failed to add contact:", error)
      throw error
    }
  }

  const updateContact = async (id: string, updates: Partial<Contact>): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      // Get the contact record ID
      const { data: contactRecord, error: recordError } = await supabase
        .from("contacts")
        .select("id")
        .eq("user_id", user.id)
        .eq("contact_id", id)
        .single()

      if (recordError) throw recordError

      // Update the contact
      const { error: updateError } = await supabase
        .from("contacts")
        .update({
          name: updates.name,
          is_blocked: updates.isBlocked,
          notes: updates.notes,
        })
        .eq("id", contactRecord.id)

      if (updateError) throw updateError

      // Update local state
      setContacts((prevContacts) =>
        prevContacts.map((contact) => (contact.id === id ? { ...contact, ...updates } : contact)),
      )
    } catch (error) {
      console.error("Failed to update contact:", error)
      throw error
    }
  }

  const deleteContact = async (id: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      // Delete the contact
      const { error } = await supabase.from("contacts").delete().eq("user_id", user.id).eq("contact_id", id)

      if (error) throw error

      // Remove from local state
      setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id))

      // Remove from all groups
      for (const group of contactGroups) {
        if (group.contacts.includes(id)) {
          await removeContactFromGroup(id, group.id)
        }
      }
    } catch (error) {
      console.error("Failed to delete contact:", error)
      throw error
    }
  }

  const getContact = async (id: string): Promise<Contact | undefined> => {
    if (!user) return undefined

    try {
      // First get the contact record
      const { data: contactRecord, error: recordError } = await supabase
        .from("contacts")
        .select("id, contact_id, name, is_blocked, notes")
        .eq("user_id", user.id)
        .eq("contact_id", id)
        .single()

      if (recordError || !contactRecord) return undefined

      // Then get the user data
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("phone_number, status")
        .eq("id", contactRecord.contact_id)
        .single()

      if (userError) return undefined

      // Get groups this contact belongs to
      const { data: groupMembers, error: groupError } = await supabase
        .from("contact_group_members")
        .select("group_id")
        .eq("contact_id", contactRecord.id)

      const groups = groupMembers ? groupMembers.map((gm) => gm.group_id) : []

      return {
        id: contactRecord.contact_id,
        name: contactRecord.name,
        phoneNumber: userData.phone_number || "",
        status: userData.status || "offline",
        groups,
        isBlocked: contactRecord.is_blocked,
        notes: contactRecord.notes,
      }
    } catch (error) {
      console.error("Failed to get contact:", error)
      return undefined
    }
  }

  const addContactGroup = async (name: string): Promise<string> => {
    if (!user) throw new Error("User not authenticated")

    try {
      // Create the group
      const { data, error } = await supabase
        .from("contact_groups")
        .insert([
          {
            user_id: user.id,
            name,
          },
        ])
        .select()

      if (error) throw error

      const newGroup: ContactGroup = {
        id: data[0].id,
        name,
        contacts: [],
      }

      // Add to local state
      setContactGroups((prevGroups) => [...prevGroups, newGroup])

      return data[0].id
    } catch (error) {
      console.error("Failed to add contact group:", error)
      throw error
    }
  }

  const updateContactGroup = async (id: string, updates: Partial<ContactGroup>): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      // Update the group
      const { error } = await supabase
        .from("contact_groups")
        .update({
          name: updates.name,
        })
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) throw error

      // Update local state
      setContactGroups((prevGroups) => prevGroups.map((group) => (group.id === id ? { ...group, ...updates } : group)))
    } catch (error) {
      console.error("Failed to update contact group:", error)
      throw error
    }
  }

  const deleteContactGroup = async (id: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      // Delete all group members first
      const { error: membersError } = await supabase.from("contact_group_members").delete().eq("group_id", id)

      if (membersError) throw membersError

      // Delete the group
      const { error } = await supabase.from("contact_groups").delete().eq("id", id).eq("user_id", user.id)

      if (error) throw error

      // Remove from local state
      setContactGroups((prevGroups) => prevGroups.filter((group) => group.id !== id))

      // Update contacts to remove this group
      setContacts((prevContacts) =>
        prevContacts.map((contact) => ({
          ...contact,
          groups: contact.groups.filter((groupId) => groupId !== id),
        })),
      )
    } catch (error) {
      console.error("Failed to delete contact group:", error)
      throw error
    }
  }

  const addContactToGroup = async (contactId: string, groupId: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      // Get the contact record ID
      const { data: contactRecord, error: recordError } = await supabase
        .from("contacts")
        .select("id")
        .eq("user_id", user.id)
        .eq("contact_id", contactId)
        .single()

      if (recordError) throw recordError

      // Add to group
      const { error } = await supabase.from("contact_group_members").insert([
        {
          group_id: groupId,
          contact_id: contactRecord.id,
        },
      ])

      if (error) throw error

      // Update local state
      setContactGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === groupId ? { ...group, contacts: [...group.contacts, contactId] } : group,
        ),
      )

      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === contactId ? { ...contact, groups: [...contact.groups, groupId] } : contact,
        ),
      )
    } catch (error) {
      console.error("Failed to add contact to group:", error)
      throw error
    }
  }

  const removeContactFromGroup = async (contactId: string, groupId: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      // Get the contact record ID
      const { data: contactRecord, error: recordError } = await supabase
        .from("contacts")
        .select("id")
        .eq("user_id", user.id)
        .eq("contact_id", contactId)
        .single()

      if (recordError) throw recordError

      // Remove from group
      const { error } = await supabase
        .from("contact_group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("contact_id", contactRecord.id)

      if (error) throw error

      // Update local state
      setContactGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === groupId ? { ...group, contacts: group.contacts.filter((id) => id !== contactId) } : group,
        ),
      )

      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === contactId ? { ...contact, groups: contact.groups.filter((id) => id !== groupId) } : contact,
        ),
      )
    } catch (error) {
      console.error("Failed to remove contact from group:", error)
      throw error
    }
  }

  const getContactsInGroup = (groupId: string): Contact[] => {
    const group = contactGroups.find((g) => g.id === groupId)
    if (!group) return []

    return contacts.filter((contact) => group.contacts.includes(contact.id))
  }

  const importContactsFromPhonebook = async (): Promise<number> => {
    // This would use the Contacts API in a real app
    // For now, we'll just add some mock contacts
    const mockContacts = [
      { name: "Alice Johnson", phoneNumber: "+1234567890", status: "online" as const, groups: [], isBlocked: false },
      { name: "Bob Smith", phoneNumber: "+1987654321", status: "offline" as const, groups: [], isBlocked: false },
      { name: "Carol White", phoneNumber: "+11223344556", status: "away" as const, groups: [], isBlocked: false },
      { name: "David Brown", phoneNumber: "+15556667777", status: "online" as const, groups: [], isBlocked: false },
    ]

    let importedCount = 0
    for (const contact of mockContacts) {
      try {
        await addContact(contact)
        importedCount++
      } catch (error) {
        console.error(`Failed to import contact ${contact.name}:`, error)
      }
    }

    return importedCount
  }

  return (
    <ContactContext.Provider
      value={{
        contacts,
        contactGroups,
        addContact,
        updateContact,
        deleteContact,
        getContact,
        addContactGroup,
        updateContactGroup,
        deleteContactGroup,
        addContactToGroup,
        removeContactFromGroup,
        getContactsInGroup,
        importContactsFromPhonebook,
      }}
    >
      {children}
    </ContactContext.Provider>
  )
}

export const useContacts = () => {
  const context = useContext(ContactContext)
  if (context === undefined) {
    throw new Error("useContacts must be used within a ContactProvider")
  }
  return context
}
