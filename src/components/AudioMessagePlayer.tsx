"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, TouchableOpacity, Text, StyleSheet } from "react-native"
import { Play, Pause } from "lucide-react-native"
import { useTheme } from "../context/ThemeContext"
import { AudioPlayer } from "../utils/audioUtils"
import { formatDuration } from "../utils/dateTimeUtils"

interface AudioMessagePlayerProps {
  uri: string
  duration: number
}

const AudioMessagePlayer: React.FC<AudioMessagePlayerProps> = ({ uri, duration }) => {
  const { colors } = useTheme()
  const [player] = useState(new AudioPlayer())
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(0)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const loadAudio = async () => {
      await player.loadAudio(uri)
    }

    loadAudio()

    return () => {
      if (timer) clearInterval(timer)
      player.unloadAudio()
    }
  }, [uri])

  const togglePlayback = async () => {
    if (isPlaying) {
      await player.pause()
      if (timer) clearInterval(timer)
      setIsPlaying(false)
    } else {
      await player.play()
      setIsPlaying(true)

      // Start a timer to update position
      const interval = setInterval(() => {
        setCurrentPosition(player.getPosition())

        // If playback has finished
        if (player.getPosition() >= duration) {
          clearInterval(interval)
          setIsPlaying(false)
          setCurrentPosition(0)
        }
      }, 100)

      setTimer(interval)
    }
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
      borderRadius: 16,
      backgroundColor: colors.card,
    },
    playButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
    },
    progressContainer: {
      flex: 1,
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      marginHorizontal: 8,
    },
    progressBar: {
      height: 4,
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
    timeText: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.7,
      marginLeft: 8,
    },
  })

  const progress = duration > 0 ? (currentPosition / duration) * 100 : 0

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
        {isPlaying ? <Pause size={18} color="white" /> : <Play size={18} color="white" />}
      </TouchableOpacity>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      <Text style={styles.timeText}>{formatDuration(isPlaying ? currentPosition : duration)}</Text>
    </View>
  )
}

export default AudioMessagePlayer
