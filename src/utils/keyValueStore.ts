import AsyncStorage from "@react-native-async-storage/async-storage"

/**
 * A utility class for storing and retrieving data from AsyncStorage
 */
export class KeyValueStore {
  /**
   * Store a value in AsyncStorage
   * @param key The key to store the value under
   * @param value The value to store
   */
  static async set(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
    } catch (error) {
      console.error("Error storing data:", error)
      throw error
    }
  }

  /**
   * Retrieve a value from AsyncStorage
   * @param key The key to retrieve the value for
   * @param defaultValue The default value to return if the key doesn't exist
   */
  static async get<T>(key: string, defaultValue: T | null = null): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      return jsonValue != null ? JSON.parse(jsonValue) : defaultValue
    } catch (error) {
      console.error("Error retrieving data:", error)
      return defaultValue
    }
  }

  /**
   * Remove a value from AsyncStorage
   * @param key The key to remove
   */
  static async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key)
    } catch (error) {
      console.error("Error removing data:", error)
      throw error
    }
  }

  /**
   * Check if a key exists in AsyncStorage
   * @param key The key to check
   */
  static async exists(key: string): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(key)
      return value != null
    } catch (error) {
      console.error("Error checking if key exists:", error)
      return false
    }
  }

  /**
   * Get all keys in AsyncStorage
   */
  static async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys()
    } catch (error) {
      console.error("Error getting all keys:", error)
      return []
    }
  }

  /**
   * Clear all data in AsyncStorage
   */
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear()
    } catch (error) {
      console.error("Error clearing data:", error)
      throw error
    }
  }

  /**
   * Get multiple items from AsyncStorage
   * @param keys The keys to retrieve
   */
  static async multiGet(keys: string[]): Promise<[string, string | null][]> {
    try {
      return await AsyncStorage.multiGet(keys)
    } catch (error) {
      console.error("Error getting multiple items:", error)
      throw error
    }
  }

  /**
   * Store multiple items in AsyncStorage
   * @param keyValuePairs The key-value pairs to store
   */
  static async multiSet(keyValuePairs: [string, string][]): Promise<void> {
    try {
      await AsyncStorage.multiSet(keyValuePairs)
    } catch (error) {
      console.error("Error setting multiple items:", error)
      throw error
    }
  }
}
