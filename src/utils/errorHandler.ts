// Create a consistent error handling utility
export const handleError = (error: any, fallbackMessage = "An error occurred"): string => {
  console.error(error)

  if (error?.message) {
    return error.message
  }

  if (typeof error === "string") {
    return error
  }

  return fallbackMessage
}

// Function to show error in UI
export const showError = (error: any, title = "Error", fallbackMessage = "An error occurred"): void => {
  import("react-native")
    .then(({ Alert }) => {
      const message = handleError(error, fallbackMessage)
      Alert.alert(title, message)
    })
    .catch(() => {
      // Fallback if Alert is not available
      console.error(`${title}: ${handleError(error, fallbackMessage)}`)
    })
}

// Function to handle API errors
export const handleApiError = async (promise: Promise<any>, fallbackMessage = "API request failed"): Promise<any> => {
  try {
    return await promise
  } catch (error) {
    showError(error, "API Error", fallbackMessage)
    throw error
  }
}
