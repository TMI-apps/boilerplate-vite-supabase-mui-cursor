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
