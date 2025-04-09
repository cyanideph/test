"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native"
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, Type } from "lucide-react-native"
import { useTheme } from "../context/ThemeContext"

interface CustomTextEditorProps {
  initialValue?: string
  onTextChange: (text: string) => void
  placeholder?: string
  maxLength?: number
  minHeight?: number
  maxHeight?: number
}

const CustomTextEditor: React.FC<CustomTextEditorProps> = ({
  initialValue = "",
  onTextChange,
  placeholder = "Type a message...",
  maxLength = 1000,
  minHeight = 50,
  maxHeight = 150,
}) => {
  const { colors } = useTheme()
  const [text, setText] = useState(initialValue)
  const [height, setHeight] = useState(minHeight)
  const [showToolbar, setShowToolbar] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("left")
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium")
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setShowToolbar(false)
    })

    return () => {
      keyboardDidHideListener.remove()
    }
  }, [])

  const handleTextChange = (value: string) => {
    setText(value)
    onTextChange(value)
  }

  const handleContentSizeChange = (event: any) => {
    const contentHeight = event.nativeEvent.contentSize.height
    setHeight(Math.min(Math.max(contentHeight, minHeight), maxHeight))
  }

  const toggleBold = () => {
    setIsBold(!isBold)
  }

  const toggleItalic = () => {
    setIsItalic(!isItalic)
  }

  const setTextAlignment = (align: "left" | "center" | "right") => {
    setAlignment(align)
  }

  const cycleFontSize = () => {
    if (fontSize === "small") setFontSize("medium")
    else if (fontSize === "medium") setFontSize("large")
    else setFontSize("small")
  }

  const getFontSize = () => {
    switch (fontSize) {
      case "small":
        return 12
      case "medium":
        return 16
      case "large":
        return 20
      default:
        return 16
    }
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
    },
    input: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      marginRight: 10,
      color: colors.text,
      fontSize: getFontSize(),
      fontWeight: isBold ? "bold" : "normal",
      fontStyle: isItalic ? "italic" : "normal",
      textAlign: alignment,
    },
    toolbar: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    toolbarButton: {
      padding: 8,
      borderRadius: 4,
    },
    toolbarButtonActive: {
      backgroundColor: colors.primary + "30",
    },
    fontSizeButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    fontSizeText: {
      marginLeft: 4,
      fontSize: 12,
      color: colors.text,
    },
  })

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      style={styles.container}
    >
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={[styles.input, { height: Math.max(height, minHeight) }]}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          value={text}
          onChangeText={handleTextChange}
          multiline
          maxLength={maxLength}
          onContentSizeChange={handleContentSizeChange}
          onFocus={() => setShowToolbar(true)}
        />
        <TouchableOpacity onPress={() => setShowToolbar(!showToolbar)}>
          <Type size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {showToolbar && (
        <View style={styles.toolbar}>
          <TouchableOpacity style={[styles.toolbarButton, isBold && styles.toolbarButtonActive]} onPress={toggleBold}>
            <Bold size={20} color={isBold ? colors.primary : colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolbarButton, isItalic && styles.toolbarButtonActive]}
            onPress={toggleItalic}
          >
            <Italic size={20} color={isItalic ? colors.primary : colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolbarButton, alignment === "left" && styles.toolbarButtonActive]}
            onPress={() => setTextAlignment("left")}
          >
            <AlignLeft size={20} color={alignment === "left" ? colors.primary : colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolbarButton, alignment === "center" && styles.toolbarButtonActive]}
            onPress={() => setTextAlignment("center")}
          >
            <AlignCenter size={20} color={alignment === "center" ? colors.primary : colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolbarButton, alignment === "right" && styles.toolbarButtonActive]}
            onPress={() => setTextAlignment("right")}
          >
            <AlignRight size={20} color={alignment === "right" ? colors.primary : colors.text} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.fontSizeButton} onPress={cycleFontSize}>
            <Type size={20} color={colors.text} />
            <Text style={styles.fontSizeText}>{fontSize.charAt(0).toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  )
}

export default CustomTextEditor
