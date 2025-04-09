// Design system for UZZAP Chat application
// This file contains the core design tokens and styles

// Color palette
export const colors = {
  // Primary brand colors
  primary: {
    50: "#f0f4ff",
    100: "#dbe4ff",
    200: "#bac8ff",
    300: "#91a7ff",
    400: "#748ffc",
    500: "#5c7cfa", // Main primary color
    600: "#4c6ef5",
    700: "#4263eb",
    800: "#3b5bdb",
    900: "#364fc7",
  },

  // Secondary colors
  secondary: {
    50: "#f3f0ff",
    100: "#e5dbff",
    200: "#d0bfff",
    300: "#b197fc",
    400: "#9775fa",
    500: "#845ef7", // Main secondary color
    600: "#7950f2",
    700: "#7048e8",
    800: "#6741d9",
    900: "#5f3dc4",
  },

  // Neutral colors
  neutral: {
    50: "#f8f9fa",
    100: "#f1f3f5",
    200: "#e9ecef",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
    600: "#868e96",
    700: "#495057",
    800: "#343a40",
    900: "#212529",
  },

  // Semantic colors
  success: {
    light: "#8ce99a",
    main: "#51cf66",
    dark: "#37b24d",
  },
  warning: {
    light: "#ffec99",
    main: "#fcc419",
    dark: "#f59f00",
  },
  error: {
    light: "#ffc9c9",
    main: "#ff6b6b",
    dark: "#fa5252",
  },
  info: {
    light: "#99e9f2",
    main: "#22b8cf",
    dark: "#0c8599",
  },

  // Status colors
  status: {
    online: "#51cf66",
    away: "#fcc419",
    busy: "#ff6b6b",
    offline: "#adb5bd",
    invisible: "#ced4da",
  },

  // Special colors
  background: {
    light: "#ffffff",
    dark: "#212529",
  },
  surface: {
    light: "#f8f9fa",
    dark: "#343a40",
  },
  divider: {
    light: "#e9ecef",
    dark: "#495057",
  },
}

// Typography
export const typography = {
  fontFamily: {
    base: "System",
    heading: "System",
  },
  fontWeight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
  lineHeight: {
    tight: 1.25,
    base: 1.5,
    relaxed: 1.75,
  },
}

// Spacing system (in pixels)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
}

// Border radius
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
}

// Shadows
export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
}

// Animation durations
export const animation = {
  fast: 200,
  normal: 300,
  slow: 500,
}

// Z-index
export const zIndex = {
  base: 1,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
}

// Theme configurations
export const lightTheme = {
  text: colors.neutral[900],
  textSecondary: colors.neutral[700],
  textTertiary: colors.neutral[600],
  background: colors.background.light,
  surface: colors.surface.light,
  surfaceHighlight: colors.neutral[100],
  divider: colors.divider.light,
  primary: colors.primary[500],
  primaryLight: colors.primary[100],
  primaryDark: colors.primary[700],
  secondary: colors.secondary[500],
  secondaryLight: colors.secondary[100],
  secondaryDark: colors.secondary[700],
  success: colors.success.main,
  warning: colors.warning.main,
  error: colors.error.main,
  info: colors.info.main,
  online: colors.status.online,
  away: colors.status.away,
  busy: colors.status.busy,
  offline: colors.status.offline,
  invisible: colors.status.invisible,
}

export const darkTheme = {
  text: colors.neutral[100],
  textSecondary: colors.neutral[300],
  textTertiary: colors.neutral[400],
  background: colors.neutral[900],
  surface: colors.neutral[800],
  surfaceHighlight: colors.neutral[700],
  divider: colors.divider.dark,
  primary: colors.primary[400],
  primaryLight: colors.primary[600],
  primaryDark: colors.primary[300],
  secondary: colors.secondary[400],
  secondaryLight: colors.secondary[600],
  secondaryDark: colors.secondary[300],
  success: colors.success.main,
  warning: colors.warning.main,
  error: colors.error.main,
  info: colors.info.main,
  online: colors.status.online,
  away: colors.status.away,
  busy: colors.status.busy,
  offline: colors.status.offline,
  invisible: colors.status.invisible,
}

// Theme variants
export const themeVariants = {
  default: lightTheme,
  dark: darkTheme,
  uzzap: {
    ...lightTheme,
    primary: colors.secondary[500],
    primaryLight: colors.secondary[100],
    primaryDark: colors.secondary[700],
    secondary: colors.primary[500],
    secondaryLight: colors.primary[100],
    secondaryDark: colors.primary[700],
  },
  ocean: {
    ...lightTheme,
    primary: "#0ea5e9",
    primaryLight: "#e0f2fe",
    primaryDark: "#0284c7",
    secondary: "#06b6d4",
    secondaryLight: "#cffafe",
    secondaryDark: "#0891b2",
  },
  rose: {
    ...lightTheme,
    primary: "#f43f5e",
    primaryLight: "#ffe4e6",
    primaryDark: "#e11d48",
    secondary: "#fb7185",
    secondaryLight: "#ffe4e6",
    secondaryDark: "#be123c",
  },
  emerald: {
    ...lightTheme,
    primary: "#10b981",
    primaryLight: "#d1fae5",
    primaryDark: "#059669",
    secondary: "#34d399",
    secondaryLight: "#a7f3d0",
    secondaryDark: "#047857",
  },
  amber: {
    ...lightTheme,
    primary: "#f59e0b",
    primaryLight: "#fef3c7",
    primaryDark: "#d97706",
    secondary: "#fbbf24",
    secondaryLight: "#fde68a",
    secondaryDark: "#b45309",
  },
}

// Animation presets
export const animationPresets = {
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  scale: {
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
  },
  slideUp: {
    from: { opacity: 0, translateY: 10 },
    to: { opacity: 1, translateY: 0 },
  },
  slideDown: {
    from: { opacity: 0, translateY: -10 },
    to: { opacity: 1, translateY: 0 },
  },
  slideLeft: {
    from: { opacity: 0, translateX: 10 },
    to: { opacity: 1, translateX: 0 },
  },
  slideRight: {
    from: { opacity: 0, translateX: -10 },
    to: { opacity: 1, translateX: 0 },
  },
}
