"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { spacing, typography } from "../../design/designSystem"
import { useToast } from "../../components/ui/ToastProvider"
import { Bell, Mail, Lock, User, Settings, Moon, Sun } from "lucide-react-native"

// Import UI components
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Modal from "../../components/ui/Modal"
import NavigationBar from "../../components/ui/NavigationBar"
import Avatar from "../../components/ui/Avatar"
import Badge from "../../components/ui/Badge"
import Card from "../../components/ui/Card"
import Divider from "../../components/ui/Divider"
import ListItem from "../../components/ui/ListItem"
import DropdownMenu from "../../components/ui/DropdownMenu"
import TabBar from "../../components/ui/TabBar"
import Checkbox from "../../components/ui/Checkbox"
import Switch from "../../components/ui/Switch"
import MessageBubble from "../../components/ui/MessageBubble"

const ComponentsShowcaseScreen = () => {
  const { colors, toggleDarkMode, isDark } = useTheme()
  const toast = useToast()

  // State for interactive components
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedTab, setSelectedTab] = useState("buttons")
  const [selectedValue, setSelectedValue] = useState("")
  const [isChecked, setIsChecked] = useState(false)
  const [isSwitchOn, setIsSwitchOn] = useState(false)

  // Sample data
  const dropdownItems = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3", disabled: true },
    { label: "Option 4", value: "option4" },
  ]

  const tabs = [
    { key: "buttons", label: "Buttons" },
    { key: "inputs", label: "Inputs" },
    { key: "cards", label: "Cards" },
    { key: "misc", label: "Misc", badge: 3 },
  ]

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <NavigationBar
        title="UI Components"
        showBackButton
        onBackPress={() => {}}
        rightComponent={
          <Button
            variant="ghost"
            onPress={toggleDarkMode}
            leftIcon={isDark ? <Sun size={20} color={colors.text} /> : <Moon size={20} color={colors.text} />}
          >
            {isDark ? "Light" : "Dark"}
          </Button>
        }
      />

      <TabBar tabs={tabs} activeTab={selectedTab} onChange={setSelectedTab} variant="pills" />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {selectedTab === "buttons" && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Buttons</Text>

            <View style={styles.componentRow}>
              <Button onPress={() => toast.showToast("Primary button pressed")}>Primary Button</Button>
            </View>

            <View style={styles.componentRow}>
              <Button variant="secondary" onPress={() => toast.showToast("Secondary button pressed")}>
                Secondary Button
              </Button>
            </View>

            <View style={styles.componentRow}>
              <Button variant="outline" onPress={() => toast.showToast("Outline button pressed")}>
                Outline Button
              </Button>
            </View>

            <View style={styles.componentRow}>
              <Button variant="ghost" onPress={() => toast.showToast("Ghost button pressed")}>
                Ghost Button
              </Button>
            </View>

            <View style={styles.componentRow}>
              <Button variant="danger" onPress={() => toast.showToast("Danger button pressed")}>
                Danger Button
              </Button>
            </View>

            <View style={styles.componentRow}>
              <Button
                leftIcon={<Bell size={18} color="white" />}
                onPress={() => toast.showToast("Button with icon pressed")}
              >
                With Icon
              </Button>
            </View>

            <View style={styles.componentRow}>
              <Button isLoading>Loading Button</Button>
            </View>

            <View style={styles.componentRow}>
              <Button disabled>Disabled Button</Button>
            </View>

            <View style={styles.componentRow}>
              <Button size="sm">Small Button</Button>
              <Button size="lg" style={{ marginLeft: spacing.md }}>
                Large Button
              </Button>
            </View>

            <View style={styles.componentRow}>
              <Button fullWidth>Full Width Button</Button>
            </View>
          </View>
        )}

        {selectedTab === "inputs" && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Inputs</Text>

            <Input label="Standard Input" placeholder="Enter text here" />

            <Input
              label="Input with Icon"
              placeholder="Enter email"
              leftIcon={<Mail size={20} color={colors.textSecondary} />}
            />

            <Input
              label="Password Input"
              placeholder="Enter password"
              isPassword
              leftIcon={<Lock size={20} color={colors.textSecondary} />}
            />

            <Input
              label="Input with Error"
              placeholder="Enter username"
              error="This field is required"
              leftIcon={<User size={20} color={colors.textSecondary} />}
            />

            <DropdownMenu
              label="Dropdown Menu"
              items={dropdownItems}
              selectedValue={selectedValue}
              onSelect={setSelectedValue}
              placeholder="Select an option"
            />

            <Checkbox label="I agree to the terms and conditions" checked={isChecked} onChange={setIsChecked} />

            <Switch
              label="Enable notifications"
              description="Receive push notifications for new messages"
              value={isSwitchOn}
              onValueChange={setIsSwitchOn}
            />
          </View>
        )}

        {selectedTab === "cards" && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Cards</Text>

            <Card style={styles.componentRow}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Elevated Card</Text>
              <Text style={[styles.cardText, { color: colors.textSecondary }]}>
                This is a card with elevation shadow.
              </Text>
              <Button style={{ marginTop: spacing.md }}>Card Action</Button>
            </Card>

            <Card variant="outlined" style={styles.componentRow}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Outlined Card</Text>
              <Text style={[styles.cardText, { color: colors.textSecondary }]}>
                This is a card with outline border.
              </Text>
            </Card>

            <Card variant="filled" style={styles.componentRow}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Filled Card</Text>
              <Text style={[styles.cardText, { color: colors.textSecondary }]}>
                This is a card with filled background.
              </Text>
            </Card>

            <Card padding="none" style={styles.componentRow}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardHeaderTitle, { color: "white" }]}>Card with Header</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardText, { color: colors.textSecondary }]}>
                  This card has a custom header and no padding.
                </Text>
              </View>
            </Card>
          </View>
        )}

        {selectedTab === "misc" && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Miscellaneous</Text>

            <View style={styles.componentRow}>
              <Text style={[styles.subSectionTitle, { color: colors.text }]}>Avatars</Text>
              <View style={styles.avatarRow}>
                <Avatar size="xs" name="John Doe" />
                <Avatar size="sm" name="Jane Smith" />
                <Avatar size="md" name="Robert Brown" />
                <Avatar size="lg" name="Alice Green" />
              </View>
              <View style={styles.avatarRow}>
                <Avatar size="md" name="Online User" status="online" />
                <Avatar size="md" name="Away User" status="away" />
                <Avatar size="md" name="Busy User" status="busy" />
                <Avatar size="md" name="Offline User" status="offline" />
              </View>
            </View>

            <Divider />

            <View style={styles.componentRow}>
              <Text style={[styles.subSectionTitle, { color: colors.text }]}>Badges</Text>
              <View style={styles.badgeRow}>
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
              </View>
            </View>

            <Divider />

            <View style={styles.componentRow}>
              <Text style={[styles.subSectionTitle, { color: colors.text }]}>List Items</Text>
              <View style={styles.listContainer}>
                <ListItem
                  title="Profile Settings"
                  subtitle="Update your personal information"
                  leftIcon={<User size={20} color={colors.primary} />}
                  showChevron
                  onPress={() => toast.showToast("Profile settings pressed")}
                />
                <ListItem
                  title="Notifications"
                  subtitle="Configure your notification preferences"
                  leftIcon={<Bell size={20} color={colors.primary} />}
                  showChevron
                  onPress={() => toast.showToast("Notifications pressed")}
                />
                <ListItem
                  title="Security"
                  subtitle="Manage your account security"
                  leftIcon={<Lock size={20} color={colors.primary} />}
                  showChevron
                  onPress={() => toast.showToast("Security pressed")}
                />

                <ListItem
                  title="Help & Support"
                  subtitle="Get assistance and answers to your questions"
                  leftIcon={<Settings size={20} color={colors.primary} />}
                  showChevron
                  onPress={() => toast.showToast("Help & Support pressed")}
                />
              </View>
            </View>

            <Divider />

            <View style={styles.componentRow}>
              <Text style={[styles.subSectionTitle, { color: colors.text }]}>Message Bubbles</Text>
              <MessageBubble text="Hello there!" isOwnMessage />
              <MessageBubble text="Hi! How can I help you?" />
            </View>
          </View>
        )}
      </ScrollView>

      <Modal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Sample Modal"
        content="This is a basic modal example."
        primaryButtonText="Confirm"
        onPrimaryPress={() => {
          toast.showToast("Modal confirmed")
          setModalVisible(false)
        }}
        secondaryButtonText="Cancel"
        onSecondaryPress={() => setModalVisible(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  contentContainer: {
    paddingBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.h4,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },
  subSectionTitle: {
    fontSize: typography.h5,
    fontWeight: "semibold",
    marginBottom: spacing.sm,
  },
  componentRow: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.h6,
    fontWeight: "bold",
    marginBottom: spacing.xs,
  },
  cardText: {
    fontSize: typography.body,
  },
  cardHeader: {
    backgroundColor: "#333",
    padding: spacing.md,
  },
  cardHeaderTitle: {
    fontSize: typography.h6,
    fontWeight: "bold",
  },
  cardBody: {
    padding: spacing.md,
  },
  avatarRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: spacing.sm,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: spacing.sm,
  },
  listContainer: {
    marginBottom: spacing.md,
  },
})

export default ComponentsShowcaseScreen
