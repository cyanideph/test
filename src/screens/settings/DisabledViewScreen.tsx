"use client"

import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { AlertTriangle, ShoppingCart } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"

const DisabledViewScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { colors } = useTheme()

  const { featureName, featureDescription, requiredPlan } = route.params as {
    featureName: string
    featureDescription: string
    requiredPlan: string
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    icon: {
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
      textAlign: "center",
    },
    description: {
      fontSize: 16,
      color: colors.text,
      opacity: 0.7,
      textAlign: "center",
      marginBottom: 24,
    },
    featureBox: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      width: "100%",
      marginBottom: 24,
      alignItems: "center",
    },
    featureName: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 8,
    },
    featureDescription: {
      fontSize: 14,
      color: colors.text,
      textAlign: "center",
    },
    planBox: {
      backgroundColor: colors.primary + "20",
      borderRadius: 8,
      padding: 16,
      width: "100%",
      marginBottom: 32,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    planTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 8,
      textAlign: "center",
    },
    planDescription: {
      fontSize: 14,
      color: colors.text,
      textAlign: "center",
    },
    upgradeButton: {
      backgroundColor: colors.primary,
      height: 50,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      flexDirection: "row",
    },
    upgradeButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 8,
    },
    backButton: {
      marginTop: 16,
      padding: 8,
    },
    backButtonText: {
      color: colors.primary,
      fontSize: 16,
    },
    image: {
      width: 200,
      height: 150,
      marginBottom: 24,
    },
  })

  return (
    <View style={styles.container}>
      <Image source={{ uri: "/placeholder.svg?height=150&width=200" }} style={styles.image} />

      <AlertTriangle size={64} color={colors.notification} style={styles.icon} />
      <Text style={styles.title}>Feature Not Available</Text>
      <Text style={styles.description}>This feature requires an upgrade to access.</Text>

      <View style={styles.featureBox}>
        <Text style={styles.featureName}>{featureName}</Text>
        <Text style={styles.featureDescription}>{featureDescription}</Text>
      </View>

      <View style={styles.planBox}>
        <Text style={styles.planTitle}>Required Plan: {requiredPlan}</Text>
        <Text style={styles.planDescription}>
          Upgrade your account to access this feature and many more premium benefits.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.upgradeButton}
        onPress={() =>
          navigation.navigate(
            "PurchaseConfirmation" as never,
            { itemId: requiredPlan === "Premium" ? "premium_monthly" : "theme_pack" } as never,
          )
        }
      >
        <ShoppingCart size={20} color="white" />
        <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  )
}

export default DisabledViewScreen
