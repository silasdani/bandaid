/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#007AFF";
const tintColorDark = "#0A84FF";

export default {
  light: {
    text: "#1D1D1F",
    background: "#FFFFFF",
    tint: tintColorLight,
    tabIconDefault: "#8E8E93",
    tabIconSelected: tintColorLight,
    primary: "#007AFF",
    secondary: "#5856D6",
    success: "#34C759",
    warning: "#FF9500",
    error: "#FF3B30",
    gray: {
      50: "#F2F2F7",
      100: "#E5E5EA",
      200: "#D1D1D6",
      300: "#C7C7CC",
      400: "#AEAEB2",
      500: "#8E8E93",
      600: "#636366",
      700: "#48484A",
      800: "#3A3A3C",
      900: "#2C2C2E",
      950: "#1C1C1E",
    },
    card: "#FFFFFF",
    cardBorder: "#E5E5EA",
    separator: "#C6C6C8",
    systemBackground: "#FFFFFF",
    secondarySystemBackground: "#F2F2F7",
    tertiarySystemBackground: "#FFFFFF",
  },
  dark: {
    text: "#FFFFFF",
    background: "#000000",
    tint: tintColorDark,
    tabIconDefault: "#8E8E93",
    tabIconSelected: tintColorDark,
    primary: "#0A84FF",
    secondary: "#5E5CE6",
    success: "#30D158",
    warning: "#FF9F0A",
    error: "#FF453A",
    gray: {
      50: "#1C1C1E",
      100: "#2C2C2E",
      200: "#3A3A3C",
      300: "#48484A",
      400: "#636366",
      500: "#8E8E93",
      600: "#AEAEB2",
      700: "#C7C7CC",
      800: "#D1D1D6",
      900: "#E5E5EA",
      950: "#F2F2F7",
    },
    card: "#1C1C1E",
    cardBorder: "#38383A",
    separator: "#38383A",
    systemBackground: "#000000",
    secondarySystemBackground: "#1C1C1E",
    tertiarySystemBackground: "#2C2C2E",
  },
};
