// Date and time utility functions

/**
 * Format a timestamp to a readable date string
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleDateString()
}

/**
 * Format a timestamp to a readable time string
 */
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

/**
 * Format a timestamp to a readable date and time string
 */
export const formatDateTime = (timestamp: number): string => {
  return `${formatDate(timestamp)} ${formatTime(timestamp)}`
}

/**
 * Get a relative time string (e.g., "2 hours ago")
 */
export const getRelativeTime = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp

  // Less than a minute
  if (diff < 60000) {
    return "Just now"
  }

  // Less than an hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
  }

  // Less than a day
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
  }

  // Less than a week
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000)
    return `${days} ${days === 1 ? "day" : "days"} ago`
  }

  // Otherwise, return the date
  return formatDate(timestamp)
}

/**
 * Format seconds to mm:ss format
 */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

/**
 * Check if a date is today
 */
export const isToday = (timestamp: number): boolean => {
  const today = new Date()
  const date = new Date(timestamp)
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

/**
 * Check if a date is yesterday
 */
export const isYesterday = (timestamp: number): boolean => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const date = new Date(timestamp)
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  )
}

/**
 * Get a smart date string (Today, Yesterday, or the date)
 */
export const getSmartDate = (timestamp: number): string => {
  if (isToday(timestamp)) {
    return "Today"
  }
  if (isYesterday(timestamp)) {
    return "Yesterday"
  }
  return formatDate(timestamp)
}
