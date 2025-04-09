/**
 * Utility class for Base64 encoding and decoding
 */
export class Base64Encoder {
  /**
   * Encode a string to Base64
   * @param str The string to encode
   */
  static encode(str: string): string {
    try {
      return btoa(unescape(encodeURIComponent(str)))
    } catch (error) {
      console.error("Error encoding to Base64:", error)
      throw error
    }
  }

  /**
   * Decode a Base64 string
   * @param str The Base64 string to decode
   */
  static decode(str: string): string {
    try {
      return decodeURIComponent(escape(atob(str)))
    } catch (error) {
      console.error("Error decoding from Base64:", error)
      throw error
    }
  }

  /**
   * Encode a binary array to Base64
   * @param buffer The binary array to encode
   */
  static encodeBuffer(buffer: ArrayBuffer): string {
    try {
      const bytes = new Uint8Array(buffer)
      let binary = ""
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      return btoa(binary)
    } catch (error) {
      console.error("Error encoding buffer to Base64:", error)
      throw error
    }
  }

  /**
   * Decode a Base64 string to a binary array
   * @param base64 The Base64 string to decode
   */
  static decodeToBuffer(base64: string): ArrayBuffer {
    try {
      const binaryString = atob(base64)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      return bytes.buffer
    } catch (error) {
      console.error("Error decoding Base64 to buffer:", error)
      throw error
    }
  }
}
