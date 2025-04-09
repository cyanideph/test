import AsyncStorage from "@react-native-async-storage/async-storage"
import * as FileSystem from "expo-file-system"
import NetInfo from "@react-native-community/netinfo"

// Interface for cached item
interface CachedItem<T> {
  data: T
  timestamp: number
  expiry: number | null // null means no expiry
}

/**
 * Cache data to AsyncStorage with optional expiry
 * @param key Cache key
 * @param data Data to cache
 * @param expiryInMinutes Expiry time in minutes (null for no expiry)
 */ \
export const cacheData = async <T>(key: string, data: T, expiryInMinutes: number | null = null)
: Promise<void> =>
{
  try {
    const timestamp = Date.now()
    const expiry = expiryInMinutes ? timestamp + expiryInMinutes * 60 * 1000 : null

    const cachedItem: CachedItem<T> = {
      data,
      timestamp,
      expiry,
    }

    await AsyncStorage.setItem(key, JSON.stringify(cachedItem))
  } catch (error) {
    console.error("Error caching data:", error)
    throw error
  }
}

/**
 * Get cached data from AsyncStorage
 * @param key Cache key
 * @returns Cached data or null if not found or expired
 */
export const getCachedData = async <T>(key: string)
: Promise<T | null> =>
{
  try {
    const cachedItemJson = await AsyncStorage.getItem(key)

    if (!cachedItemJson) {
      return null;
    }

    const cachedItem: CachedItem<T> = JSON.parse(cachedItemJson)

    // Check if expired
    if (cachedItem.expiry && cachedItem.expiry < Date.now()) {
      await AsyncStorage.removeItem(key)
      return null;
    }

    return cachedItem.data;
  } catch (error) {
    console.error("Error getting cached data:", error)
    return null;
  }
}

/**
 * Remove cached data
 * @param key Cache key
 */
export const removeCachedData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key)
  } catch (error) {
    console.error("Error removing cached data:", error)
    throw error
  }
}

/**
 * Clear all cached data
 */
export const clearAllCachedData = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys()
    const cacheKeys = keys.filter((key) => key.startsWith("cache:"))
    await AsyncStorage.multiRemove(cacheKeys)
  } catch (error) {
    console.error("Error clearing cached data:", error)
    throw error
  }
}

/**
 * Cache a file locally
 * @param url Remote URL of the file
 * @param directory Local directory to store the file
 * @returns Local URI of the cached file
 */
export const cacheFile = async (url: string, directory: string): Promise<string> => {
  try {
    // Create directory if it doesn't exist
    const dirInfo = await FileSystem.getInfoAsync(directory)
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true })
    }

    // Generate local file path
    const fileName = url.split("/").pop() || "cached_file"
    const localUri = `${directory}/${fileName}`

    // Check if file already exists
    const fileInfo = await FileSystem.getInfoAsync(localUri)
    if (fileInfo.exists) {
      return localUri
    }

    // Download file
    const { uri } = await FileSystem.downloadAsync(url, localUri)
    return uri
  } catch (error) {
    console.error("Error caching file:", error)
    throw error
  }
}

/**
 * Check if the device is online
 * @returns Boolean indicating if the device is online
 */
export const isOnline = async (): Promise<boolean> => {
  const netInfo = await NetInfo.fetch()
  return netInfo.isConnected || false
}

/**
 * Perform an operation with offline support
 * @param key Cache key
 * @param onlineOperation Function to perform when online
 * @param expiryInMinutes Cache expiry time in minutes
 * @returns Result of the operation
 */
export const withOfflineSupport = async <T>(
  key: string,
  onlineOperation: () => Promise<T>,
  expiryInMinutes: number | null = 60
)
: Promise<T> =>
{
  try {
    // Check if online
    const online = await isOnline()

    if (online) {
      try {
        // Perform online operation
        const result = await onlineOperation()

        // Cache the result
        await cacheData(`cache:${key}`, result, expiryInMinutes)

        return result;
      } catch (error) {
        // If online operation fails, try to get cached data
        console.error("Online operation failed, trying cache:", error)
        const cachedResult = await getCachedData<T>(`cache:${key}`)

        if (cachedResult) {
          return cachedResult;
        }

        // If no cached data, rethrow the error
        throw error
      }
    } else {
      // Get cached data
      const cachedResult = await getCachedData<T>(`cache:${key}`)

      if (cachedResult) {
        return cachedResult;
      }

      throw new Error("No internet connection and no cached data available")
    }
  } catch (error) {
    console.error("Error in offline operation:", error)
    throw error
  }
}

// Add a function to queue operations for when online
interface QueuedOperation {
  key: string
  operation: () => Promise<any>
  timestamp: number
}

const operationQueue: QueuedOperation[] = []

export const queueForOnline = (key: string, operation: () => Promise<any>): void => {
  operationQueue.push({
    key,
    operation,
    timestamp: Date.now(),
  })

  // Save queue to storage
  AsyncStorage.setItem("offlineOperationQueue", JSON.stringify(operationQueue)).catch((error) =>
    console.error("Failed to save operation queue:", error),
  )
}

export const processQueuedOperations = async (): Promise<void> => {
  const online = await isOnline()

  if (!online || operationQueue.length === 0) {
    return
  }

  console.log(`Processing ${operationQueue.length} queued operations`)

  // Process operations in order
  while (operationQueue.length > 0) {
    const operation = operationQueue.shift()
    if (!operation) continue

    try {
      await operation.operation()
      console.log(`Successfully processed operation: ${operation.key}`)
    } catch (error) {
      console.error(`Failed to process operation ${operation.key}:`, error)
      // Put back in queue if it's a temporary failure
      if (error.message?.includes("network") || error.message?.includes("timeout")) {
        operationQueue.unshift(operation)
        break // Stop processing for now
      }
    }
  }

  // Save updated queue
  AsyncStorage.setItem("offlineOperationQueue", JSON.stringify(operationQueue)).catch((error) =>
    console.error("Failed to save operation queue:", error),
  )
}

// Set up a listener to process queue when app comes online
export const setupOfflineQueueProcessor = (): (() => void) => {
  // Load queue from storage
  AsyncStorage.getItem("offlineOperationQueue")
    .then((queueJson) => {
      if (queueJson) {
        const savedQueue = JSON.parse(queueJson)
        operationQueue.push(...savedQueue)
      }
    })
    .catch((error) => console.error("Failed to load operation queue:", error))

  // Process queue immediately if online
  processQueuedOperations()

  // Set up interval to check and process queue
  const interval = setInterval(processQueuedOperations, 60000) // Every minute

  // Set up network state change listener
  const unsubscribe = NetInfo.addEventListener((state) => {
    if (state.isConnected) {
      processQueuedOperations()
    }
  })

  // Return cleanup function
  return () => {
    clearInterval(interval)
    unsubscribe()
  }
}
