/**
 * Theme Module - Main Entry Point
 *
 * This module exports the active theme instance and theme management utilities.
 * The theme is loaded from localStorage if a custom theme exists, otherwise uses the default theme.
 *
 * Usage:
 * ```tsx
 * import { theme } from "@/shared/theme/theme";
 * import { ThemeProvider } from "@mui/material/styles";
 *
 * <ThemeProvider theme={theme}>
 *   <App />
 * </ThemeProvider>
 * ```
 *
 * Theme Management:
 * - getCustomTheme(): Get custom theme from localStorage
 * - saveCustomTheme(options): Save custom theme to localStorage
 * - removeCustomTheme(): Remove custom theme (revert to default)
 * - validateThemeOptions(json): Validate theme JSON string
 */

import { loadTheme } from "./themeLoader";

// Export the loaded theme (custom if available, otherwise default)
export const theme = loadTheme();

// Re-export utilities for theme management
export {
  getCustomTheme,
  saveCustomTheme,
  removeCustomTheme,
  validateThemeOptions,
} from "./themeLoader";
export { defaultTheme, defaultThemeOptions } from "./defaultTheme";
