/**
 * Theme model definition
 * 
 * @typedef {Object} Theme
 * @property {string} primary - Primary color (usually text color)
 * @property {string} secondary - Secondary color (usually background color)
 * @property {string} accent - Accent color for highlights
 * @property {number} fontSize - Base font size in pixels
 * @property {boolean} isDarkMode - Whether dark mode is enabled
 */

/**
 * Default theme configurations
 */
export const LIGHT_THEME = {
  primary: '#000000',
  secondary: '#ffffff',
  accent: '#043A14',
  fontSize: 16,
  isDarkMode: false,
};

export const DARK_THEME = {
  primary: '#ffffff',
  secondary: '#121212',
  accent: '#2e7d32',
  fontSize: 16,
  isDarkMode: true,
};

/**
 * Default theme configuration - always set to light mode
 * 
 * @type {Theme}
 */
export const DEFAULT_THEME = LIGHT_THEME;

/**
 * Theme CSS variable names
 */
export const THEME_VARIABLES = {
  PRIMARY_COLOR: '--primary-color',
  SECONDARY_COLOR: '--secondary-color',
  ACCENT_COLOR: '--accent-color',
  ACCENT_COLOR_DARK: '--accent-color-dark',
  GLOBAL_FONT_SIZE: '--global-font-size',
  GLOBAL_BG: '--global-bg',
  GLOBAL_COLOR: '--global-color',
  CARD_BG: '--card-bg',
  TEXT_MUTED: '--text-muted',
  SHADOW_COLOR: '--shadow-color',
  IS_DARK_MODE: '--is-dark-mode',
};

/**
 * Set a theme CSS variable on the document root element
 * 
 * @param {string} variable - CSS variable name
 * @param {string} value - CSS variable value
 */
export const setThemeVariable = (variable, value) => {
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty(variable, value);
  }
};