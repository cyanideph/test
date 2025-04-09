"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { CreditCard, Check, ShoppingCart } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"

// Mock purchase items
const purchaseItems = [
  {
    id: "premium_monthly",
    name: "UZZAP Premium",
    description: "Monthly subscription",
    price: 4.99,
    type: "subscription",
    duration: 30, // days
    features: ["Ad-free experience", "Unlimited message storage", "Custom themes", "Priority support"],
  },
  {
    id: "premium_yearly",
    name: "UZZAP Premium",
    description: "Yearly subscription (Save 20%)",
    price: 47.99,
    type: "subscription",
    duration: 365, // days
    features: ["Ad-free experience", "Unlimited message storage", "Custom themes", "Priority support"],
  },
  {
    id: "theme_pack",
    name: "Theme Pack",
    description: "10 additional themes",
    price: 2.99,
    type: "oneTime",
    features: ["10 exclusive themes", "Lifetime access"],
  },
]

const PurchaseConfirmationScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { colors } = useTheme()

  const { itemId } = route.params as { itemId: string }
  const purchaseItem = purchaseItems.find((item) => item.id === itemId)

  const [isProcessing, setIsProcessing] = useState(false)

  const handlePurchase = async () => {
    setIsProcessing(true)

    // Simulate purchase processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsProcessing(false)
    Alert.alert("Purchase Successful", `You have successfully purchased ${purchaseItem.name}!`, [
      {
        text: "OK",
        onPress: () => navigation.navigate("SettingsScreen"),
      },
    ])
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 16,
    },
    header: {
      alignItems: "center",
      marginBottom: 24,
    },
    icon: {
      marginBottom: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
      textAlign: "center",
    },
    itemCard: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 24,
    },
    itemName: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    itemDescription: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
      marginBottom: 16,
    },
    priceContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    priceLabel: {
      fontSize: 16,
      color: colors.text,
    },
    price: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.primary,
    },
    featuresTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
    },
    featureItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    featureIcon: {
      marginRight: 8,
    },
    featureText: {
      fontSize: 14,
      color: colors.text,
    },
    paymentSection: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 24,
    },
    paymentTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
    },
    paymentMethod: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 8,
      backgroundColor: colors.primary + "10",
    },
    paymentIcon: {
      marginRight: 12,
    },
    paymentText: {
      fontSize: 14,
      color: colors.text,
    },
    termsText: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.7,
      textAlign: "center",
      marginBottom: 24,
    },
    purchaseButton: {
      backgroundColor: colors.primary,
      height: 50,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
    },
    purchaseButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 8,
    },
    cancelButton: {
      backgroundColor: colors.border,
      height: 50,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 12,
    },
    cancelButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "bold",
    },
  })

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <ShoppingCart size={64} color={colors.primary} style={styles.icon} />
          <Text style={styles.title}>Confirm Purchase</Text>
          <Text style={styles.subtitle}>Review your purchase details before confirming</Text>
        </View>

        <View style={styles.itemCard}>
          <Text style={styles.itemName}>{purchaseItem.name}</Text>
          <Text style={styles.itemDescription}>{purchaseItem.description}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>${purchaseItem.price.toFixed(2)}</Text>
          </View>

          <Text style={styles.featuresTitle}>Features</Text>
          {purchaseItem.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Check size={16} color={colors.primary} style={styles.featureIcon} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Payment Method</Text>
          <View style={styles.paymentMethod}>
            <CreditCard size={24} color={colors.primary} style={styles.paymentIcon} />
            <Text style={styles.paymentText}>Credit Card</Text>
          </View>
        </View>

        <Text style={styles.termsText}>
          By completing this purchase, you agree to our Terms of Service and Privacy Policy.
          {purchaseItem.type === "subscription"
            ? ` Your subscription will automatically renew every ${purchaseItem.duration} days until canceled.`
            : ""}
        </Text>

        <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase} disabled={isProcessing}>
          {isProcessing ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <ShoppingCart size={20} color="white" />
              <Text style={styles.purchaseButtonText}>Complete Purchase (${purchaseItem.price.toFixed(2)})</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={isProcessing}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default PurchaseConfirmationScreen
