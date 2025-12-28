import { useRef, useEffect } from 'react';

/**
 * Hook to trap focus within a container for improved accessibility
 * Useful for modals, dialogs, and other overlays
 * 
 * @param {boolean} active - Whether the focus trap is active
 * @returns {React.RefObject} - Ref to attach to the containing element
 */
export const useFocusTrap = (active = true) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    // Find all focusable elements
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Set initial focus
    firstElement.focus();

    // Handle tabbing
    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      // Shift + Tab
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } 
      // Tab
      else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    // Add event listener
    container.addEventListener('keydown', handleTabKey);

    // Store original focus to restore later
    const originalFocus = document.activeElement;

    return () => {
      container.removeEventListener('keydown', handleTabKey);
      // Restore focus when component unmounts
      if (originalFocus) {
        originalFocus.focus();
      }
    };
  }, [active]);

  return containerRef;
};

/**
 * Hook to manage focus when content updates or visibility changes
 * 
 * @param {boolean} visible - Whether the content is visible
 * @param {array} dependencies - Array of dependencies that should trigger focus
 * @returns {React.RefObject} - Ref to attach to the element that should receive focus
 */
export const useManagedFocus = (visible = true, dependencies = []) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (visible && elementRef.current) {
      elementRef.current.focus();
    }
  }, [visible, ...dependencies]);

  return elementRef;
};