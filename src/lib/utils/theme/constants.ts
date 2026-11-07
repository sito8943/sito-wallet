import type { ThemeColors } from "@sito/dashboard-app";

// Wallet-specific config for @sito/dashboard-app's ThemeProvider.
// Keep the key: it holds users' saved preference (also read by the inline boot
// script in `index.html`).
export const THEME_STORAGE_KEY = "sito-wallet-theme";

/** `<meta name="theme-color">` per theme (browser chrome / PWA status bar). */
export const THEME_COLOR_META = {
  light: "#041e42",
  dark: "#0f141c",
} as const satisfies ThemeColors;
