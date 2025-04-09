// src/utils/offlineSupport.ts

import { cacheData, getCachedData, isOnline, queueForOnline } from "./offlineCache"

/**
 * Performs an operation with offline support, queuing it for later if offline.
 * @param key Cache key
 * @param onlineOperation Function to perform when online
 * @param expiryInMinutes Cache expiry time in minutes
 * @returns Result of the operation
 */
export const withOfflineSupport = async <T>(\
  key: string,
  onlineOperation: () => Promise<T>,
  expiryInMinutes: number | null = 60,
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

        return result
      } catch (error) {
        // If online operation fails, try to get cached data
        console.error("Online operation failed, trying cache:", error)
        const cachedResult = await getCachedData<T>(`cache:${key}`)

        if (cachedResult) {
          return cachedResult
        }

        // If no cached data, rethrow the error
        throw error
      }
    } else {
      // Get cached data
      const cachedResult = await getCachedData<T>(`cache:${key}`)

      if (cachedResult) {
        return cachedResult
      }

      // Queue the operation for later
      queueForOnline(key, onlineOperation)

      throw new Error("No internet connection and no cached data available. Operation queued for later.")
    }
  } catch (error) {
    console.error("Error in offline operation:", error)
    throw error
  }
}
