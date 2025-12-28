import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_THEME, LIGHT_THEME, DARK_THEME, THEME_VARIABLES, setThemeVariable } from '../models/themeModel';
import { COLORS } from '../styles/styleConstants';

// Create theme context
const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  updateTheme: () => {},
  applyTheme: () => {},
  toggleDarkMode: () => {},
  isDarkMode: false,
});

/**
 * Local storage key for theme
 */
const THEME_STORAGE_KEY = 'wedding_theme';

/**
 * Apply theme values to CSS variables on the document
 * 
 * @param {Object} theme - Theme object
 */
const applyThemeToDocument = (theme) => {
  // Apply base theme colors
  setThemeVariable(THEME_VARIABLES.PRIMARY_COLOR, theme.primary);
  setThemeVariable(THEME_VARIABLES.SECONDARY_COLOR, theme.secondary);
  setThemeVariable(THEME_VARIABLES.ACCENT_COLOR, theme.accent);
  setThemeVariable(THEME_VARIABLES.ACCENT_COLOR_DARK, theme.isDarkMode ? 
    COLORS.PRIMARY.LIGHT : COLORS.PRIMARY.DARK);
  setThemeVariable(THEME_VARIABLES.GLOBAL_FONT_SIZE, `${theme.fontSize}px`);
  
  // Set background and text colors
  setThemeVariable(THEME_VARIABLES.GLOBAL_BG, theme.secondary);
  setThemeVariable(THEME_VARIABLES.GLOBAL_COLOR, theme.primary);
  
  // Additional theme variables for dark mode
  setThemeVariable(THEME_VARIABLES.CARD_BG, theme.isDarkMode ? '#1e1e1e' : '#ffffff');
  setThemeVariable(THEME_VARIABLES.TEXT_MUTED, theme.isDarkMode ? '#bbbbbb' : '#666666');
  setThemeVariable(THEME_VARIABLES.SHADOW_COLOR, theme.isDarkMode ? 
    'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.15)');
  
  // Set dark mode flag
  setThemeVariable(THEME_VARIABLES.IS_DARK_MODE, theme.isDarkMode ? '1' : '0');
};

/**
 * Provider component for theme management
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Initialize from localStorage with fallback to default theme
    if (typeof window === 'undefined') return DEFAULT_THEME;
    
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    let initialTheme = DEFAULT_THEME;
    
    // Always use light mode as default if no stored theme
    if (!saved) {
      initialTheme = LIGHT_THEME; // Default to light theme regardless of system preference
    } else {
      try {
        const parsedTheme = JSON.parse(saved);
        initialTheme = parsedTheme.isDarkMode ? 
          { ...DARK_THEME, ...parsedTheme } : 
          { ...LIGHT_THEME, ...parsedTheme };
      } catch (error) {
        console.error('Error parsing theme from localStorage:', error);
      }
    }
    
    return initialTheme;
  });

  // Apply theme on initial render and when theme changes
  useEffect(() => {
    applyThemeToDocument(theme);
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  }, [theme]);

  /**
   * Update a specific theme property
   * 
   * @param {string} property - Theme property to update
   * @param {any} value - New value for the property
   */
  const updateTheme = (property, value) => {
    setTheme(prevTheme => ({ 
      ...prevTheme, 
      [property]: property === 'fontSize' ? Number(value) : value
    }));
  };

  /**
   * Apply a complete theme object
   * 
   * @param {Object} newTheme - Complete theme object
   */
  const applyTheme = (newTheme) => {
    setTheme(newTheme);
  };

  /**
   * Toggle between light and dark mode
   */
  const toggleDarkMode = useCallback(() => {
    setTheme(prevTheme => {
      const nextTheme = prevTheme.isDarkMode ? LIGHT_THEME : DARK_THEME;
      // Preserve user customizations when switching modes
      return { 
        ...nextTheme,
        fontSize: prevTheme.fontSize,
        accent: prevTheme.isDarkMode ? prevTheme.accent : prevTheme.accent,
      };
    });
  }, []);

  // Create the context value
  const contextValue = {
    theme,
    updateTheme,
    applyTheme,
    toggleDarkMode,
    isDarkMode: theme.isDarkMode
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access the theme context
 * @returns {Object} Theme context value
 */
export const useTheme = () => useContext(ThemeContext);