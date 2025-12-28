/**
 * Utility function to dynamically load external fonts.
 * This ensures fonts are loaded only once and available across components.
 */
export const loadFont = (fontFamily, url) => {
  if (typeof document === 'undefined') return;
  
  const fontId = `${fontFamily.replace(/\s+/g, '-').toLowerCase()}-font`;
  
  // Check if font is already loaded
  if (!document.getElementById(fontId)) {
    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  }
};

/**
 * Load commonly used fonts for the wedding website
 */
export const loadCommonFonts = () => {
  loadFont('Great Vibes', 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
  loadFont('Cormorant Garamond', 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');
  loadFont('Dancing Script', 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
};

/**
 * Font family constants to be used across the application
 * for consistent typography and styling
 */
export const FONT_FAMILIES = {
  SCRIPT: 'Great Vibes, cursive',
  PRIMARY: 'Cormorant Garamond, serif',
  DANCING: 'Dancing Script, cursive',
  SYSTEM: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
};