"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import type { Message, ChatRoom } from "../models/types"
import { supabase } from "../utils/supabaseClient"
import { uploadImage, uploadAudio } from "../utils/mediaStorage"
import { withOfflineSupport } from "../utils/offlineSupport"

interface ChatContextType {
  chatRooms: ChatRoom[]
  messages: Record<string, Message[]>
  createChatRoom: (name: string, participants: string[], isGroup?: boolean) => Promise<string>
  sendMessage: (
    roomId: string,
    content: string,
    type?: "text" | "emoticon" | "audio" | "image",
    metadata?: any,
  ) => Promise<void>
  markRoomAsRead: (roomId: string) => Promise<void>
  getChatRoomMessages: (roomId: string) => Message[]
  getChatRoom: (roomId: string) => ChatRoom | undefined
  updateChatRoom: (roomId: string, updates: Partial<ChatRoom>) => Promise<void>
  deleteChatRoom: (roomId: string) => Promise<void>
  clearChatHistory: (roomId: string) => Promise<void>
  clearAllChatHistory: () => Promise<void>
  addParticipantToGroup: (roomId: string, participantId: string) => Promise<void>
  removeParticipantFromGroup: (roomId: string, participantId: string) => Promise<void>
  leaveGroup: (roomId: string) => Promise<void>
  getStoredMessages: () => Promise<Record<string, Message[]>>
  exportChatHistory: (roomId: string) => Promise<string>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [subscriptions, setSubscriptions] = useState<any[]>([])

  // Implement pagination for message loading
  const loadChatMessages = async (roomId: string, limit = 50, offset = 0) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`
        id,
        sender_id,
        content,
        type,
        metadata,
        is_read,
        created_at,
        users:sender_id (username)
      `)
        .eq("chat_room_id", roomId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error(`Failed to load messages for room ${roomId}:`, error)
        return []
      }

      return data.map((msg) => ({
        id: msg.id,
        senderId: msg.sender_id,
        senderName: msg.users.username,
        content: msg.content,
        timestamp: new Date(msg.created_at).getTime(),
        isRead: msg.is_read,
        type: msg.type,
        metadata: msg.metadata,
      }))
    } catch (error) {
      console.error(`Failed to load messages for room ${roomId}:`, error)
      return []
    }
  }

  // Update the useEffect to use pagination
  useEffect(() => {
    // Load chat data when user logs in
    const loadChatData = async () => {
      if (!user) return

      try {
        // Get all chat rooms the user is part of
        const { data: roomParticipants, error: participantsError } = await supabase
          .from("chat_room_participants")
          .select("chat_room_id")
          .eq("user_id", user.id)

        if (participantsError) {
          console.error("Failed to load chat participants:", participantsError)
          return
        }

        const roomIds = roomParticipants.map((p) => p.chat_room_id)

        if (roomIds.length === 0) {
          setChatRooms([])
          return
        }

        // Get chat room details
        const { data: rooms, error: roomsError } = await supabase
          .from("chat_rooms")
          .select(`
          id,
          name,
          is_group,
          group_admin,
          created_at
        `)
          .in("id", roomIds)

        if (roomsError) {
          console.error("Failed to load chat rooms:", roomsError)
          return
        }

        // Get last message for each room
        const roomsWithLastMessage = await Promise.all(
          rooms.map(async (room) => {
            const { data: lastMessageData, error: lastMessageError } = await supabase
              .from("messages")
              .select("*")
              .eq("chat_room_id", room.id)
              .order("created_at", { ascending: false })
              .limit(1)

            if (lastMessageError) {
              console.error("Failed to load last message:", lastMessageError)
              return room
            }

            // Get unread count using the database function
            const { data: unreadCountData, error: countError } = await supabase.rpc("get_unread_count", {
              p_room_id: room.id,
              p_user_id: user.id,
            })

            const unreadCount = countError ? 0 : unreadCountData || 0

            // Get participants
            const { data: participants, error: participantsError } = await supabase
              .from("chat_room_participants")
              .select("user_id")
              .eq("chat_room_id", room.id)

            if (participantsError) {
              console.error("Failed to load participants:", participantsError)
            }

            const lastMessage =
              lastMessageData && lastMessageData.length > 0
                ? {
                    content: lastMessageData[0].content,
                    timestamp: new Date(lastMessageData[0].created_at).getTime(),
                    senderId: lastMessageData[0].sender_id,
                    type: lastMessageData[0].type,
                  }
                : undefined

            return {
              id: room.id,
              name: room.name,
              participants: participants?.map((p) => p.user_id) || [],
              isGroup: room.is_group,
              groupAdmin: room.group_admin,
              lastMessage,
              unreadCount,
              createdAt: new Date(room.created_at).getTime(),
            }
          }),
        )

        setChatRooms(roomsWithLastMessage)

        // Subscribe to new messages for each room
        const newSubscriptions = roomIds.map((roomId) => {
          return supabase
            .channel(`room:${roomId}`)
            .on(
              "postgres_changes",
              {
                event: "INSERT",
                schema: "public",
                table: "messages",
                filter: `chat_room_id=eq.${roomId}`,
              },
              (payload) => {
                handleNewMessage(payload.new)
              },
            )
            .subscribe()
        })

        setSubscriptions(newSubscriptions)

        // Load initial messages for each room (just the most recent ones)
        const messagesObj: Record<string, Message[]> = {}

        for (const roomId of roomIds) {
          const roomMessages = await loadChatMessages(roomId, 20, 0)
          messagesObj[roomId] = roomMessages
        }

        setMessages(messagesObj)
      } catch (error) {
        console.error("Failed to load chat data:", error)
      }
    }

    loadChatData()

    // Cleanup subscriptions
    return () => {
      subscriptions.forEach((subscription) => {
        supabase.removeChannel(subscription)
      })
    }
  }, [user])

  const handleNewMessage = (newMessage: any) => {
    // Update messages state with the new message
    setMessages((prevMessages) => {
      const roomId = newMessage.chat_room_id
      const roomMessages = prevMessages[roomId] || []

      // Check if message already exists
      if (roomMessages.some((msg) => msg.id === newMessage.id)) {
        return prevMessages
      }

      // Get sender name (this would ideally come from the payload)
      const senderName = "Unknown"

      // Create formatted message
      const formattedMessage: Message = {
        id: newMessage.id,
        senderId: newMessage.sender_id,
        senderName,
        content: newMessage.content,
        timestamp: new Date(newMessage.created_at).getTime(),
        isRead: newMessage.is_read,
        type: newMessage.type,
        metadata: newMessage.metadata,
      }

      return {
        ...prevMessages,
        [roomId]: [...roomMessages, formattedMessage],
      }
    })

    // Update chat room with last message
    setChatRooms((prevRooms) => {
      return prevRooms.map((room) => {
        if (room.id === newMessage.chat_room_id) {
          const isFromCurrentUser = user?.id === newMessage.sender_id
          return {
            ...room,
            lastMessage: {
              content: newMessage.content,
              timestamp: new Date(newMessage.created_at).getTime(),
              senderId: newMessage.sender_id,
              type: newMessage.type,
            },
            unreadCount: isFromCurrentUser ? room.unreadCount : room.unreadCount + 1,
          }
        }
        return room
      })
    })
  }

  const createChatRoom = async (name: string, participants: string[], isGroup = false): Promise<string> => {
    if (!user) throw new Error("User not authenticated")

    // Include current user in participants if not already included
    if (!participants.includes(user.id)) {
      participants.push(user.id)
    }

    try {
      // Create the chat room
      const { data: roomData, error: roomError } = await supabase
        .from("chat_rooms")
        .insert([
          {
            name,
            is_group: isGroup,
            group_admin: isGroup ? user.id : null,
          },
        ])
        .select()

      if (roomError) throw roomError

      const roomId = roomData[0].id

      // Add participants
      const participantInserts = participants.map((participantId) => ({
        chat_room_id: roomId,
        user_id: participantId,
      }))

      const { error: participantsError } = await supabase.from("chat_room_participants").insert(participantInserts)

      if (participantsError) throw participantsError

      // Subscribe to new messages for this room
      const subscription = supabase
        .channel(`room:${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `chat_room_id=eq.${roomId}`,
          },
          (payload) => {
            handleNewMessage(payload.new)
          },
        )
        .subscribe()

      setSubscriptions((prev) => [...prev, subscription])

      // Add the new room to state
      const newRoom: ChatRoom = {
        id: roomId,
        name,
        participants,
        isGroup,
        groupAdmin: isGroup ? user.id : undefined,
        unreadCount: 0,
        createdAt: Date.now(),
      }

      setChatRooms((prev) => [...prev, newRoom])
      setMessages((prev) => ({ ...prev, [roomId]: [] }))

      return roomId
    } catch (error) {
      console.error("Failed to create chat room:", error)
      throw error
    }
  }

  // Update the sendMessage function to use offline support
  const sendMessage = async (
    roomId: string,
    content: string,
    type: "text" | "emoticon" | "audio" | "image" = "text",
    metadata?: any,
  ) => {
    if (!user) throw new Error("User not authenticated")

    try {
      // Handle media uploads
      let finalContent = content

      if (type === "image") {
        // Upload image to Supabase Storage
        finalContent = await uploadImage(content, roomId)
      } else if (type === "audio") {
        // Upload audio to Supabase Storage
        finalContent = await uploadAudio(content, roomId)
      }

      // Create message object
      const messageData = {
        chat_room_id: roomId,
        sender_id: user.id,
        content: finalContent,
        type,
        metadata,
        is_read: false,
      }

      // Use offline support utility
      await withOfflineSupport(
        `message:${roomId}:${Date.now()}`,
        async () => {
          const { data, error } = await supabase.from("messages").insert([messageData]).select()

          if (error) throw error
          return data[0]
        },
        30, // Cache for 30 minutes
      )

      // The real-time subscription will handle updating the UI
    } catch (error) {
      console.error("Failed to send message:", error)
      throw error
    }
  }

  // Update the markRoomAsRead function to use the database function
  const markRoomAsRead = async (roomId: string) => {
    if (!user) return

    try {
      // Use the database function instead of direct update
      const { error } = await supabase.rpc("mark_messages_as_read", {
        p_room_id: roomId,
        p_user_id: user.id,
      })

      if (error) throw error

      // Update local state
      setMessages((prevMessages) => {
        const roomMessages = prevMessages[roomId] || []
        return {
          ...prevMessages,
          [roomId]: roomMessages.map((msg) => ({ ...msg, isRead: true })),
        }
      })

      setChatRooms((prevRooms) => prevRooms.map((room) => (room.id === roomId ? { ...room, unreadCount: 0 } : room)))
    } catch (error) {
      console.error("Failed to mark room as read:", error)
    }
  }

  const getChatRoomMessages = (roomId: string): Message[] => {
    return messages[roomId] || []
  }

  const getChatRoom = (roomId: string): ChatRoom | undefined => {
    return chatRooms.find((room) => room.id === roomId)
  }

  const updateChatRoom = async (roomId: string, updates: Partial<ChatRoom>) => {
    try {
      const { error } = await supabase
        .from("chat_rooms")
        .update({
          name: updates.name,
          group_admin: updates.groupAdmin,
        })
        .eq("id", roomId)

      if (error) throw error

      setChatRooms((prevRooms) => prevRooms.map((room) => (room.id === roomId ? { ...room, ...updates } : room)))
    } catch (error) {
      console.error("Failed to update chat room:", error)
      throw error
    }
  }

  const deleteChatRoom = async (roomId: string) => {
    try {
      // Delete all messages in the room
      await supabase.from("messages").delete().eq("chat_room_id", roomId)

      // Delete all participants
      await supabase.from("chat_room_participants").delete().eq("chat_room_id", roomId)

      // Delete the chat room
      await supabase.from("chat_rooms").delete().eq("id", roomId)

      // Remove the chat room from state
      setChatRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId))

      // Remove the messages for this room
      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages }
        delete newMessages[roomId]
        return newMessages
      })
    } catch (error) {
      console.error("Failed to delete chat room:", error)
      throw error
    }
  }

  const clearChatHistory = async (roomId: string) => {
    try {
      // Delete all messages in the room
      await supabase.from("messages").delete().eq("chat_room_id", roomId)

      // Clear messages for this room
      setMessages((prevMessages) => ({
        ...prevMessages,
        [roomId]: [],
      }))

      // Update the chat room to remove last message
      setChatRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === roomId
            ? {
                ...room,
                lastMessage: undefined,
                unreadCount: 0,
              }
            : room,
        ),
      )
    } catch (error) {
      console.error("Failed to clear chat history:", error)
      throw error
    }
  }

  const clearAllChatHistory = async () => {
    if (!user) return

    try {
      // Get all chat rooms the user is part of
      const { data: roomParticipants, error: participantsError } = await supabase
        .from("chat_room_participants")
        .select("chat_room_id")
        .eq("user_id", user.id)

      if (participantsError) throw participantsError

      const roomIds = roomParticipants.map((p) => p.chat_room_id)

      // Delete all messages in these rooms
      if (roomIds.length > 0) {
        await supabase.from("messages").delete().in("chat_room_id", roomIds)
      }

      // Clear all messages
      setMessages({})

      // Update all chat rooms to remove last messages
      setChatRooms((prevRooms) =>
        prevRooms.map((room) => ({
          ...room,
          lastMessage: undefined,
          unreadCount: 0,
        })),
      )
    } catch (error) {
      console.error("Failed to clear all chat history:", error)
      throw error
    }
  }

  const addParticipantToGroup = async (roomId: string, participantId: string) => {
    try {
      // Check if user is already in the group
      const { data: existingParticipant, error: checkError } = await supabase
        .from("chat_room_participants")
        .select("*")
        .eq("chat_room_id", roomId)
        .eq("user_id", participantId)
        .single()

      if (existingParticipant) return // Already in the group

      // Add participant to the group
      const { error } = await supabase.from("chat_room_participants").insert([
        {
          chat_room_id: roomId,
          user_id: participantId,
        },
      ])

      if (error) throw error

      // Update local state
      setChatRooms((prevRooms) =>
        prevRooms.map((r) =>
          r.id === roomId
            ? {
                ...r,
                participants: [...r.participants, participantId],
              }
            : r,
        ),
      )
    } catch (error) {
      console.error("Failed to add participant to group:", error)
      throw error
    }
  }

  const removeParticipantFromGroup = async (roomId: string, participantId: string) => {
    try {
      // Remove participant from the group
      const { error } = await supabase
        .from("chat_room_participants")
        .delete()
        .eq("chat_room_id", roomId)
        .eq("user_id", participantId)

      if (error) throw error

      // Update local state
      setChatRooms((prevRooms) =>
        prevRooms.map((r) =>
          r.id === roomId
            ? {
                ...r,
                participants: r.participants.filter((id) => id !== participantId),
              }
            : r,
        ),
      )
    } catch (error) {
      console.error("Failed to remove participant from group:", error)
      throw error
    }
  }

  const leaveGroup = async (roomId: string) => {
    if (!user) return

    try {
      const room = chatRooms.find((r) => r.id === roomId)
      if (!room || !room.isGroup) return

      // If the user is the group admin, assign a new admin
      if (user.id === room.groupAdmin) {
        const newAdmin = room.participants.find((id) => id !== user.id)

        if (newAdmin) {
          // Update group admin
          await supabase.from("chat_rooms").update({ group_admin: newAdmin }).eq("id", roomId)

          // Remove user from participants
          await supabase.from("chat_room_participants").delete().eq("chat_room_id", roomId).eq("user_id", user.id)

          // Update local state
          setChatRooms((prevRooms) =>
            prevRooms.map((r) =>
              r.id === roomId
                ? {
                    ...r,
                    participants: r.participants.filter((id) => id !== user.id),
                    groupAdmin: newAdmin,
                  }
                : r,
            ),
          )
        } else {
          // If no other participants, delete the group
          await deleteChatRoom(roomId)
        }
      } else {
        // Just remove the user from participants
        await supabase.from("chat_room_participants").delete().eq("chat_room_id", roomId).eq("user_id", user.id)

        // Update local state
        setChatRooms((prevRooms) =>
          prevRooms.map((r) =>
            r.id === roomId
              ? {
                  ...r,
                  participants: r.participants.filter((id) => id !== user.id),
                }
              : r,
          ),
        )
      }
    } catch (error) {
      console.error("Failed to leave group:", error)
      throw error
    }
  }

  const getStoredMessages = async (): Promise<Record<string, Message[]>> => {
    return messages
  }

  const exportChatHistory = async (roomId: string): Promise<string> => {
    const roomMessages = messages[roomId] || []
    const room = chatRooms.find((r) => r.id === roomId)

    if (!room) return "Chat not found"

    let exportText = `Chat History for ${room.name}\n`
    exportText += `Exported on ${new Date().toLocaleString()}\n\n`

    roomMessages.forEach((msg) => {
      const date = new Date(msg.timestamp).toLocaleString()
      exportText += `[${date}] ${msg.senderName}: `

      if (msg.type === "text" || msg.type === "emoticon") {
        exportText += msg.content
      } else if (msg.type === "audio") {
        exportText += "[Audio Message]"
      } else if (msg.type === "image") {
        exportText += "[Image]"
      }

      exportText += "\n"
    })

    return exportText
  }

  return (
    <ChatContext.Provider
      value={{
        chatRooms,
        messages,
        createChatRoom,
        sendMessage,
        markRoomAsRead,
        getChatRoomMessages,
        getChatRoom,
        updateChatRoom,
        deleteChatRoom,
        clearChatHistory,
        clearAllChatHistory,
        addParticipantToGroup,
        removeParticipantFromGroup,
        leaveGroup,
        getStoredMessages,
        exportChatHistory,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
