"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native"
import { Mic, Square, Play } from "lucide-react-native"
import { useTheme } from "../context/ThemeContext"
import { AudioRecorder } from "../utils/audioUtils"
import { formatDuration } from "../utils/dateTimeUtils"

interface AudioRecorderButtonProps {
  onAudioReady: (uri: string, duration: number) => void
  onCancel: () => void
}

const AudioRecorderButton: React.FC<AudioRecorderButtonProps> = ({ onAudioReady, onCancel }) => {
  const { colors } = useTheme()
  const [recorder] = useState(new AudioRecorder())
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [recordingComplete, setRecordingComplete] = useState(false)
  const [audioUri, setAudioUri] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      // Clean up when component unmounts
      if (timer) clearInterval(timer)
      recorder.cleanup()
    }
  }, [])

  const startRecording = async () => {
    await recorder.startRecording()
    setIsRecording(true)
    setRecordingDuration(0)

    // Start a timer to track recording duration
    const interval = setInterval(() => {
      setRecordingDuration((prev) => prev + 1)
    }, 1000)

    setTimer(interval)
  }

  const stopRecording = async () => {
    if (timer) clearInterval(timer)

    const uri = await recorder.stopRecording()
    if (uri) {
      const duration = await recorder.getDuration()
      setAudioUri(uri)
      setRecordingComplete(true)
    }

    setIsRecording(false)
  }

  const playRecording = async () => {
    setIsPlaying(true)
    await recorder.playRecording()
    setIsPlaying(false)
  }

  const handleSend = async () => {
    if (audioUri) {
      const duration = await recorder.getDuration()
      onAudioReady(audioUri, duration)
    }
  }

  const handleCancel = () => {
    recorder.cleanup()
    onCancel()
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    recordButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: isRecording ? colors.notification : colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    stopButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.notification,
      justifyContent: "center",
      alignItems: "center",
    },
    playButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
    },
    durationText: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      marginHorizontal: 10,
    },
    actionButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 16,
      marginLeft: 8,
    },
    sendButton: {
      backgroundColor: colors.primary,
    },
    cancelButton: {
      backgroundColor: colors.notification,
    },
    actionButtonText: {
      color: "white",
      fontWeight: "bold",
    },
  })

  if (recordingComplete) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.playButton} onPress={playRecording} disabled={isPlaying}>
          {isPlaying ? <ActivityIndicator color="white" /> : <Play size={24} color="white" />}
        </TouchableOpacity>

        <Text style={styles.durationText}>{formatDuration(recordingDuration)}</Text>

        <TouchableOpacity style={[styles.actionButton, styles.sendButton]} onPress={handleSend}>
          <Text style={styles.actionButtonText}>Send</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleCancel}>
          <Text style={styles.actionButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {isRecording ? (
        <>
          <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
            <Square size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.durationText}>Recording... {formatDuration(recordingDuration)}</Text>
          <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleCancel}>
            <Text style={styles.actionButtonText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
            <Mic size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.durationText}>Tap to record audio message</Text>
          <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleCancel}>
            <Text style={styles.actionButtonText}>Cancel</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

export default AudioRecorderButton
