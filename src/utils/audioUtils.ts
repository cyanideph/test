import { Audio } from "expo-av"
import * as FileSystem from "expo-file-system"
import { Alert } from "react-native"

// Audio recording class
export class AudioRecorder {
  private recording: Audio.Recording | null = null
  private sound: Audio.Sound | null = null
  private uri: string | null = null

  constructor() {
    // Initialize audio mode
    this.setupAudioMode()
  }

  private async setupAudioMode() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    })
  }

  async startRecording(): Promise<void> {
    try {
      // Request permissions
      const { granted } = await Audio.requestPermissionsAsync()
      if (!granted) {
        Alert.alert("Permission required", "You need to grant audio recording permissions to record audio messages.")
        return
      }

      // Create recording
      this.recording = new Audio.Recording()
      await this.recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
      await this.recording.startAsync()
    } catch (error) {
      console.error("Failed to start recording:", error)
      Alert.alert("Error", "Failed to start recording")
    }
  }

  async stopRecording(): Promise<string | null> {
    try {
      if (!this.recording) {
        return null
      }

      await this.recording.stopAndUnloadAsync()
      this.uri = this.recording.getURI() || null
      this.recording = null
      return this.uri
    } catch (error) {
      console.error("Failed to stop recording:", error)
      Alert.alert("Error", "Failed to stop recording")
      return null
    }
  }

  async playRecording(): Promise<void> {
    try {
      if (!this.uri) {
        return
      }

      // Load and play the sound
      const { sound } = await Audio.Sound.createAsync({ uri: this.uri })
      this.sound = sound
      await this.sound.playAsync()
    } catch (error) {
      console.error("Failed to play recording:", error)
      Alert.alert("Error", "Failed to play recording")
    }
  }

  async stopPlaying(): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.stopAsync()
        await this.sound.unloadAsync()
        this.sound = null
      }
    } catch (error) {
      console.error("Failed to stop playing:", error)
    }
  }

  async saveRecording(chatId: string): Promise<string | null> {
    try {
      if (!this.uri) {
        return null
      }

      // Create a unique filename
      const fileName = `audio_${Date.now()}.m4a`
      const directory = `${FileSystem.documentDirectory}audio/${chatId}/`

      // Ensure directory exists
      const dirInfo = await FileSystem.getInfoAsync(directory)
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true })
      }

      const newUri = `${directory}${fileName}`

      // Copy the file
      await FileSystem.copyAsync({
        from: this.uri,
        to: newUri,
      })

      return newUri
    } catch (error) {
      console.error("Failed to save recording:", error)
      Alert.alert("Error", "Failed to save recording")
      return null
    }
  }

  async getDuration(): Promise<number> {
    try {
      if (!this.uri) {
        return 0
      }

      const { sound } = await Audio.Sound.createAsync({ uri: this.uri })
      const status = await sound.getStatusAsync()
      await sound.unloadAsync()

      return status.durationMillis ? status.durationMillis / 1000 : 0
    } catch (error) {
      console.error("Failed to get duration:", error)
      return 0
    }
  }

  async cleanup(): Promise<void> {
    try {
      if (this.recording) {
        await this.recording.stopAndUnloadAsync()
        this.recording = null
      }

      if (this.sound) {
        await this.sound.unloadAsync()
        this.sound = null
      }

      this.uri = null
    } catch (error) {
      console.error("Failed to clean up audio resources:", error)
    }
  }
}

// Audio player for messages
export class AudioPlayer {
  private sound: Audio.Sound | null = null
  private isPlaying = false
  private position = 0
  private duration = 0

  async loadAudio(uri: string): Promise<void> {
    try {
      // Unload any existing audio
      await this.unloadAudio()

      // Load the new audio
      const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: false }, this.onPlaybackStatusUpdate)

      this.sound = sound
      const status = await sound.getStatusAsync()
      this.duration = status.durationMillis ? status.durationMillis / 1000 : 0
    } catch (error) {
      console.error("Failed to load audio:", error)
      Alert.alert("Error", "Failed to load audio")
    }
  }

  private onPlaybackStatusUpdate = (status: Audio.PlaybackStatus) => {
    if (status.isLoaded) {
      this.isPlaying = status.isPlaying
      this.position = status.positionMillis / 1000

      // If playback has finished, reset position
      if (status.didJustFinish) {
        this.position = 0
      }
    }
  }

  async play(): Promise<void> {
    try {
      if (!this.sound) {
        return
      }

      await this.sound.playAsync()
    } catch (error) {
      console.error("Failed to play audio:", error)
      Alert.alert("Error", "Failed to play audio")
    }
  }

  async pause(): Promise<void> {
    try {
      if (!this.sound) {
        return
      }

      await this.sound.pauseAsync()
    } catch (error) {
      console.error("Failed to pause audio:", error)
    }
  }

  async stop(): Promise<void> {
    try {
      if (!this.sound) {
        return
      }

      await this.sound.stopAsync()
      await this.sound.setPositionAsync(0)
    } catch (error) {
      console.error("Failed to stop audio:", error)
    }
  }

  async seekTo(position: number): Promise<void> {
    try {
      if (!this.sound) {
        return
      }

      await this.sound.setPositionAsync(position * 1000)
    } catch (error) {
      console.error("Failed to seek audio:", error)
    }
  }

  async unloadAudio(): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.unloadAsync()
        this.sound = null
        this.isPlaying = false
        this.position = 0
        this.duration = 0
      }
    } catch (error) {
      console.error("Failed to unload audio:", error)
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying
  }

  getPosition(): number {
    return this.position
  }

  getDuration(): number {
    return this.duration
  }

  getProgress(): number {
    return this.duration > 0 ? this.position / this.duration : 0
  }
}
