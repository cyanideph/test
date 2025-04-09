import * as FileSystem from "expo-file-system"
import * as ImagePicker from "expo-image-picker"
import * as ImageManipulator from "expo-image-manipulator"
import { Platform } from "react-native"
import { supabase } from "./supabaseClient"
import { v4 as uuidv4 } from "uuid"

// Storage bucket name
const STORAGE_BUCKET = "media"

/**
 * Upload an image to Supabase Storage
 * @param uri Local URI of the image
 * @param folder Folder to store the image in
 * @returns Public URL of the uploaded image
 */
export const uploadImage = async (uri: string, folder = "images"): Promise<string> => {
  try {
    // Validate file type
    const fileExt = uri.split(".").pop()?.toLowerCase()
    const allowedTypes = ["jpg", "jpeg", "png", "gif"]

    if (!fileExt || !allowedTypes.includes(fileExt)) {
      throw new Error("Invalid file type. Only JPG, PNG, and GIF are allowed.")
    }

    // Compress the image first
    const compressedImage = await compressImage(uri)

    // Check file size (limit to 5MB)
    const fileInfo = await FileSystem.getInfoAsync(compressedImage.uri)
    if (fileInfo.size && fileInfo.size > 5 * 1024 * 1024) {
      throw new Error("File too large. Maximum size is 5MB.")
    }

    // Convert to blob
    const blob = await uriToBlob(compressedImage.uri)

    // Generate a unique file name
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, blob, {
      contentType: `image/${fileExt}`,
      upsert: false,
    })

    if (error) {
      throw error
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath)

    return publicUrlData.publicUrl
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

/**
 * Upload an audio file to Supabase Storage
 * @param uri Local URI of the audio file
 * @param folder Folder to store the audio in
 * @returns Public URL of the uploaded audio
 */
export const uploadAudio = async (uri: string, folder = "audio"): Promise<string> => {
  try {
    // Validate file type
    const fileExt = uri.split(".").pop()?.toLowerCase()
    const allowedTypes = ["m4a", "mp3", "wav", "aac"]

    if (!fileExt || !allowedTypes.includes(fileExt)) {
      throw new Error("Invalid audio file type.")
    }

    // Check file size (limit to 10MB)
    const fileInfo = await FileSystem.getInfoAsync(uri)
    if (fileInfo.size && fileInfo.size > 10 * 1024 * 1024) {
      throw new Error("Audio file too large. Maximum size is 10MB.")
    }

    // Convert to blob
    const blob = await uriToBlob(uri)

    // Generate a unique file name
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, blob, {
      contentType: `audio/${fileExt}`,
      upsert: false,
    })

    if (error) {
      throw error
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath)

    return publicUrlData.publicUrl
  } catch (error) {
    console.error("Error uploading audio:", error)
    throw error
  }
}

/**
 * Delete a file from Supabase Storage
 * @param url Public URL of the file
 */
export const deleteFile = async (url: string): Promise<void> => {
  try {
    // Extract the path from the URL
    const path = url.split(`${STORAGE_BUCKET}/`)[1]

    if (!path) {
      throw new Error("Invalid file URL")
    }

    // Delete from Supabase Storage
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path])

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Error deleting file:", error)
    throw error
  }
}

/**
 * Download a file from Supabase Storage to local filesystem
 * @param url Public URL of the file
 * @returns Local URI of the downloaded file
 */
export const downloadFile = async (url: string): Promise<string> => {
  try {
    // Generate a local file path
    const fileName = url.split("/").pop() || "download"
    const fileUri = `${FileSystem.documentDirectory}${fileName}`

    // Download the file
    const { uri } = await FileSystem.downloadAsync(url, fileUri)

    return uri
  } catch (error) {
    console.error("Error downloading file:", error)
    throw error
  }
}

/**
 * Pick an image from the device's library
 * @returns Object containing the selected image's URI
 */
export const pickImage = async (): Promise<ImagePicker.ImagePickerResult> => {
  // Request permission
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

  if (status !== "granted") {
    throw new Error("Permission to access media library was denied")
  }

  // Pick an image
  return ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  })
}

/**
 * Take a photo using the device's camera
 * @returns Object containing the captured image's URI
 */
export const takePhoto = async (): Promise<ImagePicker.ImagePickerResult> => {
  // Request permission
  const { status } = await ImagePicker.requestCameraPermissionsAsync()

  if (status !== "granted") {
    throw new Error("Permission to access camera was denied")
  }

  // Take a photo
  return ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  })
}

/**
 * Compress an image to reduce file size
 * @param uri Local URI of the image
 * @returns Compressed image result
 */
export const compressImage = async (uri: string): Promise<ImageManipulator.ImageResult> => {
  return ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1080 } }], // Resize to max width of 1080px
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
  )
}

/**
 * Convert a URI to a Blob object
 * @param uri Local URI of the file
 * @returns Blob object
 */
export const uriToBlob = async (uri: string): Promise<Blob> => {
  if (Platform.OS === "web") {
    const response = await fetch(uri)
    return await response.blob()
  }

  const fileString = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  })

  const byteCharacters = atob(fileString)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  return new Blob(byteArrays, { type: "application/octet-stream" })
}

/**
 * Get a temporary local URI for a file from Supabase Storage
 * @param path Path of the file in Supabase Storage
 * @returns Temporary local URI
 */
export const getTemporaryLocalUri = async (path: string): Promise<string> => {
  try {
    // Get signed URL (valid for a short time)
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).createSignedUrl(path, 60) // Valid for 60 seconds

    if (error) {
      throw error
    }

    return data.signedUrl
  } catch (error) {
    console.error("Error getting temporary URI:", error)
    throw error
  }
}
