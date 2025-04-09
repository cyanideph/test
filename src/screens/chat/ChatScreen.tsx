"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import { Send, Smile, Mic, Image as ImageIcon } from "lucide-react-native"
import { useChat } from "../../context/ChatContext"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import EmoticonPicker from "../../components/EmoticonPicker"
import AudioRecorderButton from "../../components/AudioRecorderButton"
import * as ImagePicker from "expo-image-picker"
import { format } from "date-fns"
import AudioMessagePlayer from "../../components/AudioMessagePlayer"

const ChatScreen = () => {
  const [message, setMessage] = useState("")
  const [showEmoticonPicker, setShowEmoticonPicker] = useState(false)
  const [showAudioRecorder, setShowAudioRecorder] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const route = useRoute()
  const navigation = useNavigation()
  const { roomId, name } = route.params as { roomId: string; name: string }
  const { getChatRoomMessages, sendMessage, markRoomAsRead, getChatRoom } = useChat()
  const { user } = useAuth()
  const { colors } = useTheme()
  const flatListRef = useRef(null)

  const messages = getChatRoomMessages(roomId)
  const chatRoom = getChatRoom(roomId)

  useEffect(() => {
    // Mark messages as read when entering the chat
    markRoomAsRead(roomId)

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // Set navigation options
    navigation.setOptions({
      headerShown: false,
    })
  }, [roomId, navigation])

  const handleSend = async () => {
    if (!message.trim()) return

    await sendMessage(roomId, message.trim(), "text")
    setMessage("")

    // Scroll to bottom after sending
    setTimeout(() => {
      if (flatListRef.current && messages.length > 0) {
        flatListRef.current.scrollToEnd({ animated: true })
      }
    }, 100)
  }

  const handleEmoticonSelect = async (emoticon: string) => {
    await sendMessage(roomId, emoticon, "emoticon")
  }

  const handleAudioReady = async (uri: string, duration: number) => {
    await sendMessage(roomId, uri, "audio", { duration })
    setShowAudioRecorder(false)

    // Scroll to bottom after sending
    setTimeout(() => {
      if (flatListRef.current && messages.length > 0) {
        flatListRef.current.scrollToEnd({ animated: true })
      }
    }, 100)
  }

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      await sendMessage(roomId, result.assets[0].uri, "image")

      // Scroll to bottom after sending
      setTimeout(() => {
        if (flatListRef.current && messages.length > 0) {
          flatListRef.current.scrollToEnd({ animated: true })
        }
      }, 100)
    }
  }

  const renderMessage = ({ item }) => {
    const isMyMessage = item.senderId === user?.id
    const messageTime = format(new Date(item.timestamp), "h:mm a")

    return (
      <View style={[styles.messageContainer, isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer]}>
        {!isMyMessage && <Text style={styles.senderName}>{item.senderName}</Text>}

        <View
          style={[
            styles.messageBubble,
            isMyMessage ? [styles.myMessageBubble, { backgroundColor: colors.primary }] : styles.otherMessageBubble,
          ]}
        >
          {item.type === "text" && (
            <Text style={[styles.messageText, isMyMessage ? styles.myMessageText : styles.otherMessageText]}>
              {item.content}
            </Text>
          )}

          {item.type === "emoticon" && <Text style={styles.emoticonText}>{item.content}</Text>}

          {item.type === "audio" && <AudioMessagePlayer uri={item.content} duration={item.metadata?.duration || 0} />}

          {item.type === "image" && <Image source={{ uri: item.content }} style={styles.messageImage} />}
        </View>

        <Text style={[styles.messageTime, isMyMessage ? styles.myMessageTime : styles.otherMessageTime]}>
          {messageTime}
        </Text>
      </View>
    )
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    chatContainer: {
      flex: 1,
      padding: 10,
    },
    messageContainer: {
      marginVertical: 4,
      maxWidth: "80%",
    },
    myMessageContainer: {
      alignSelf: "flex-end",
    },
    otherMessageContainer: {
      alignSelf: "flex-start",
    },
    senderName: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.7,
      marginBottom: 2,
      marginLeft: 12,
    },
    messageBubble: {
      borderRadius: 18,
      padding: 12,
    },
    myMessageBubble: {
      borderBottomRightRadius: 4,
    },
    otherMessageBubble: {
      backgroundColor: colors.card,
      borderBottomLeftRadius: 4,
    },
    messageText: {
      fontSize: 16,
    },
    myMessageText: {
      color: "white",
    },
    otherMessageText: {
      color: colors.text,
    },
    emoticonText: {
      fontSize: 32,
    },
    messageImage: {
      width: 200,
      height: 150,
      borderRadius: 8,
    },
    messageTime: {
      fontSize: 10,
      marginTop: 2,
      opacity: 0.7,
    },
    myMessageTime: {
      alignSelf: "flex-end",
      color: colors.text,
    },
    otherMessageTime: {
      alignSelf: "flex-start",
      color: colors.text,
    },
    inputContainer: {
      flexDirection: "row",
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    input: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      marginRight: 10,
      color: colors.text,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    mediaButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    emptyText: {
      fontSize: 16,
      color: colors.text,
      opacity: 0.7,
      textAlign: "center",
    },
  })

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.chatContainer}>
        {messages.length > 0 ? (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            onContentSizeChange={() => {
              if (flatListRef.current && messages.length > 0) {
                flatListRef.current.scrollToEnd({ animated: false })
              }
            }}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet. Send a message to start the conversation!</Text>
          </View>
        )}
      </View>

      {showAudioRecorder ? (
        <AudioRecorderButton onAudioReady={handleAudioReady} onCancel={() => setShowAudioRecorder(false)} />
      ) : (
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.mediaButton} onPress={() => setShowEmoticonPicker(true)}>
            <Smile size={24} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.mediaButton} onPress={handlePickImage}>
            <ImageIcon size={24} color={colors.text} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#94a3b8"
            value={message}
            onChangeText={setMessage}
            multiline
          />

          {message.trim() ? (
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Send size={20} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: colors.secondary }]}
              onPress={() => setShowAudioRecorder(true)}
            >
              <Mic size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      )}

      <EmoticonPicker
        isVisible={showEmoticonPicker}
        onClose={() => setShowEmoticonPicker(false)}
        onSelect={handleEmoticonSelect}
      />
    </KeyboardAvoidingView>
  )
}

export default ChatScreen
