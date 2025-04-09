// Core data types for the application

export interface User {
  id: string
  username: string
  phoneNumber: string
  status: "online" | "away" | "offline"
  lastSeen?: number
}

// Ensure message types match schema
export interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: number
  isRead: boolean
  type: "text" | "emoticon" | "audio" | "image" // Match schema types exactly
  metadata?: {
    duration?: number // For audio messages
    emoticonId?: string // For emoticon messages
    imageUrl?: string // For image messages
    width?: number // For image dimensions
    height?: number // For image dimensions
  }
}

export interface ChatRoom {
  id: string
  name: string
  participants: string[]
  isGroup: boolean
  groupAdmin?: string // User ID of group admin
  lastMessage?: {
    content: string
    timestamp: number
    senderId: string
    type: "text" | "emoticon" | "audio" | "image"
  }
  unreadCount: number
  createdAt: number
}

export interface Contact {
  id: string
  name: string
  phoneNumber: string
  status: "online" | "away" | "offline"
  groups: string[] // IDs of groups this contact belongs to
  isBlocked: boolean
  notes?: string
}

export interface ContactGroup {
  id: string
  name: string
  contacts: string[] // Contact IDs
}

export interface Emoticon {
  id: string
  name: string
  category: string
  imageUrl: string
}

// Update AppSettings to match the database schema
export interface AppSettings {
  theme: string
  notifications: boolean
  autoLogin: boolean
  keypadLock: boolean
  keypadLockPin?: string
  offlineMode: boolean
  chatBackgroundImage?: string
  fontSizeLevel: "small" | "medium" | "large"
  soundEnabled: boolean
  vibrationEnabled: boolean
  lastBackupDate?: number
}

export interface PurchaseItem {
  id: string
  name: string
  description: string
  price: number
  type: "subscription" | "oneTime"
  duration?: number // In days, for subscriptions
}
