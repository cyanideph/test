"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { RefreshCw, AlertTriangle } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"

const AutoRenewViewScreen = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()

  const [autoRenew, setAutoRenew] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock subscription data
  const subscription = {
    plan: "UZZAP Premium",
    price: "$4.99",
    billingCycle: "Monthly",
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    paymentMethod: "Credit Card (•••• 1234)",
  }

  const handleToggleAutoRenew = async (value: boolean) => {
    setIsProcessing(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setAutoRenew(value)

      Alert.alert(
        value ? "Auto-Renewal Enabled" : "Auto-Renewal Disabled",
        value
          ? "Your subscription will automatically renew on the next billing date."
          : "Your subscription will expire on the next billing date.",
      )
    } catch (error) {
      console.error("Failed to update auto-renewal settings:", error)
      Alert.alert("Error", "Failed to update auto-renewal settings")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancelSubscription = () => {
    Alert.alert(
      "Cancel Subscription",
      "Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing cycle.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            setIsProcessing(true)
            try {
              // Simulate API call
              await new Promise((resolve) => setTimeout(resolve, 1500))
              Alert.alert("Subscription Cancelled", "Your subscription has been cancelled.", [
                { text: "OK", onPress: () => navigation.goBack() },
              ])
            } catch (error) {
              console.error("Failed to cancel subscription:", error)
              Alert.alert("Error", "Failed to cancel subscription")
            } finally {
              setIsProcessing(false)
            }
          },
        },
      ],
    )
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    section: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 16,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    label: {
      fontSize: 16,
      color: colors.text,
    },
    value: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "bold",
    },
    autoRenewRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    autoRenewLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    warningBox: {
      backgroundColor: colors.notification + "20", // Add transparency
      borderRadius: 8,
      padding: 16,
      marginBottom: 24,
      flexDirection: "row",
      alignItems: "center",
    },
    warningIcon: {
      marginRight: 12,
    },
    warningText: {
      flex: 1,
      fontSize: 14,
      color: colors.notification,
    },
    cancelButton: {
      backgroundColor: colors.notification,
      height: 50,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    cancelButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    backButton: {
      backgroundColor: colors.border,
      height: 50,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 12,
    },
    backButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "bold",
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <RefreshCw size={64} color={colors.primary} style={styles.icon} />
        <Text style={styles.title}>Subscription Settings</Text>
        <Text style={styles.subtitle}>Manage your subscription and auto-renewal settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Subscription</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Plan</Text>
          <Text style={styles.value}>{subscription.plan}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Price</Text>
          <Text style={styles.value}>{subscription.price}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Billing Cycle</Text>
          <Text style={styles.value}>{subscription.billingCycle}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Next Billing Date</Text>
          <Text style={styles.value}>{subscription.nextBillingDate}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Payment Method</Text>
          <Text style={styles.value}>{subscription.paymentMethod}</Text>
        </View>

        <View style={styles.autoRenewRow}>
          <Text style={styles.autoRenewLabel}>Auto-Renew</Text>
          {isProcessing ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Switch
              value={autoRenew}
              onValueChange={handleToggleAutoRenew}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="white"
            />
          )}
        </View>
      </View>

      {!autoRenew && (
        <View style={styles.warningBox}>
          <AlertTriangle size={24} color={colors.notification} style={styles.warningIcon} />
          <Text style={styles.warningText}>
            Your subscription will expire on {subscription.nextBillingDate}. After this date, you will lose access to
            premium features.
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.cancelButton} onPress={handleCancelSubscription} disabled={isProcessing}>
        {isProcessing ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={isProcessing}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AutoRenewViewScreen
