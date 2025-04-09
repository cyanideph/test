"use client"
import { createStackNavigator } from "@react-navigation/stack"
import { useState } from "react"

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useAuth } from "../context/AuthContext"
import { useSettings } from "../context/SettingsContext"
import { MessageCircle, Users, Settings } from "lucide-react-native"

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen"
import RegistrationScreen from "../screens/auth/RegistrationScreen"
import MobileValidationScreen from "../screens/auth/MobileValidationScreen"

// Main Screens
import ChatRoomsScreen from "../screens/chat/ChatRoomsScreen"
import ChatScreen from "../screens/chat/ChatScreen"
import ContactsScreen from "../screens/contacts/ContactsScreen"
import ContactFormScreen from "../screens/contacts/ContactFormScreen"
import SettingsScreen from "../screens/settings/SettingsScreen"
import ThemesScreen from "../screens/settings/ThemesScreen"

// New Screens
import GroupChatCreationScreen from "../screens/groups/GroupChatCreationScreen"
import GroupDetailsScreen from "../screens/groups/GroupDetailsScreen"
import SecuritySettingsScreen from "../screens/settings/SecuritySettingsScreen"
import OfflineSettingsScreen from "../screens/settings/OfflineSettingsScreen"
import ClearHistoryConfirmationScreen from "../screens/settings/ClearHistoryConfirmationScreen"
import HelpScreen from "../screens/help/HelpScreen"
import AboutScreen from "../screens/help/AboutScreen"
import ChatInvitationScreen from "../screens/chat/ChatInvitationScreen"
import DeleteContactConfirmationScreen from "../screens/contacts/DeleteContactConfirmationScreen"
import PhonebookImportScreen from "../screens/contacts/PhonebookImportScreen"
import ContactGroupsScreen from "../screens/contacts/ContactGroupsScreen"
import AutoLoginConfirmationScreen from "../screens/settings/AutoLoginConfirmationScreen"
import StoredMessagesScreen from "../screens/chat/StoredMessagesScreen"
import PurchaseConfirmationScreen from "../screens/settings/PurchaseConfirmationScreen"
import SMSHandlerScreen from "../screens/chat/SMSHandlerScreen"
import DisabledViewScreen from "../screens/settings/DisabledViewScreen"
import AutoRenewViewScreen from "../screens/settings/AutoRenewViewScreen"
import GroupBuddyAdderScreen from "../screens/groups/GroupBuddyAdderScreen"
import GroupContactsViewScreen from "../screens/groups/GroupContactsViewScreen"
import GroupRenamerScreen from "../screens/groups/GroupRenamerScreen"
import MultipleContactHandlerScreen from "../screens/contacts/MultipleContactHandlerScreen"

// Components
import KeypadLock from "../components/KeypadLock"

const AuthStack = createStackNavigator()
const MainTab = createBottomTabNavigator()
const ChatStack = createStackNavigator()
const ContactsStack = createStackNavigator()
const SettingsStack = createStackNavigator()

const ChatStackNavigator = () => (
  <ChatStack.Navigator>
    <ChatStack.Screen name="ChatRooms" component={ChatRoomsScreen} options={{ title: "Chats" }} />
    <ChatStack.Screen
      name="Chat"
      component={ChatScreen}
      options={({ route }) => ({ title: route.params?.name || "Chat" })}
    />
    <ChatStack.Screen
      name="GroupChatCreation"
      component={GroupChatCreationScreen}
      options={{ title: "Create Group" }}
    />
    <ChatStack.Screen name="GroupDetails" component={GroupDetailsScreen} options={{ title: "Group Details" }} />
    <ChatStack.Screen
      name="ClearHistory"
      component={ClearHistoryConfirmationScreen}
      options={{ title: "Clear History" }}
    />
    <ChatStack.Screen name="ChatInvitation" component={ChatInvitationScreen} options={{ title: "Invite to Chat" }} />
    <ChatStack.Screen name="StoredMessages" component={StoredMessagesScreen} options={{ title: "Stored Messages" }} />
    <ChatStack.Screen name="SMSHandler" component={SMSHandlerScreen} options={{ title: "Send SMS" }} />
    <ChatStack.Screen name="GroupBuddyAdder" component={GroupBuddyAdderScreen} options={{ title: "Add Members" }} />
    <ChatStack.Screen
      name="GroupContacts"
      component={GroupContactsViewScreen}
      options={({ route }) => ({ title: route.params?.groupName || "Group Members" })}
    />
    <ChatStack.Screen name="GroupRenamer" component={GroupRenamerScreen} options={{ title: "Rename Group" }} />
  </ChatStack.Navigator>
)

const ContactsStackNavigator = () => (
  <ContactsStack.Navigator>
    <ContactsStack.Screen name="ContactsList" component={ContactsScreen} options={{ title: "Contacts" }} />
    <ContactsStack.Screen name="ContactForm" component={ContactFormScreen} options={{ title: "Add Contact" }} />
    <ContactsStack.Screen
      name="DeleteContact"
      component={DeleteContactConfirmationScreen}
      options={{ title: "Delete Contact" }}
    />
    <ContactsStack.Screen
      name="PhonebookImport"
      component={PhonebookImportScreen}
      options={{ title: "Import Contacts" }}
    />
    <ContactsStack.Screen name="ContactGroups" component={ContactGroupsScreen} options={{ title: "Contact Groups" }} />
    <ContactsStack.Screen
      name="MultipleContactHandler"
      component={MultipleContactHandlerScreen}
      options={{ title: "Contact Actions" }}
    />
  </ContactsStack.Navigator>
)

const SettingsStackNavigator = () => (
  <SettingsStack.Navigator>
    <SettingsStack.Screen name="SettingsMain" component={SettingsScreen} options={{ title: "Settings" }} />
    <SettingsStack.Screen name="Themes" component={ThemesScreen} options={{ title: "Themes" }} />
    <SettingsStack.Screen name="Security" component={SecuritySettingsScreen} options={{ title: "Security" }} />
    <SettingsStack.Screen
      name="OfflineSettings"
      component={OfflineSettingsScreen}
      options={{ title: "Offline Mode" }}
    />
    <SettingsStack.Screen name="Help" component={HelpScreen} options={{ title: "Help & Support" }} />
    <SettingsStack.Screen name="About" component={AboutScreen} options={{ title: "About UZZAP" }} />
    <SettingsStack.Screen name="AutoLogin" component={AutoLoginConfirmationScreen} options={{ title: "Auto Login" }} />
    <SettingsStack.Screen
      name="PurchaseConfirmation"
      component={PurchaseConfirmationScreen}
      options={{ title: "Purchase" }}
    />
    <SettingsStack.Screen name="DisabledView" component={DisabledViewScreen} options={{ title: "Feature Locked" }} />
    <SettingsStack.Screen
      name="AutoRenewView"
      component={AutoRenewViewScreen}
      options={{ title: "Subscription Settings" }}
    />
  </SettingsStack.Navigator>
)

const MainTabNavigator = () => (
  <MainTab.Navigator
    screenOptions={{
      tabBarActiveTintColor: "#6366f1",
      tabBarInactiveTintColor: "#94a3b8",
      tabBarStyle: {
        borderTopWidth: 1,
        borderTopColor: "#e2e8f0",
      },
    }}
  >
    <MainTab.Screen
      name="Chats"
      component={ChatStackNavigator}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
      }}
    />
    <MainTab.Screen
      name="Contacts"
      component={ContactsStackNavigator}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
      }}
    />
    <MainTab.Screen
      name="Settings"
      component={SettingsStackNavigator}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
      }}
    />
  </MainTab.Navigator>
)

const MainNavigator = () => {
  const { isAuthenticated } = useAuth()
  const { isKeypadLocked, settings } = useSettings()
  const [keypadUnlocked, setKeypadUnlocked] = useState(false)

  // If keypad lock is enabled and the app is locked, show the keypad lock screen
  if (isAuthenticated && settings.keypadLock && isKeypadLocked && !keypadUnlocked) {
    return <KeypadLock onUnlock={() => setKeypadUnlocked(true)} />
  }

  return (
    <>
      {isAuthenticated ? (
        <MainTabNavigator />
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Registration" component={RegistrationScreen} />
          <AuthStack.Screen name="MobileValidation" component={MobileValidationScreen} />
        </AuthStack.Navigator>
      )}
    </>
  )
}

export default MainNavigator
