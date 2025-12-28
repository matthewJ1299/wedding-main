import { useState, useEffect, useRef } from 'react';

/**
 * Hook to detect when an element enters the viewport
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - How much of the element should be visible
 * @param {string|Element} options.root - The element used as viewport (null = browser viewport)
 * @param {string} options.rootMargin - Margin around the root element
 * @returns {Array} [ref, isVisible, entry] - The ref to attach, visibility state, and IntersectionObserver entry
 */
export const useIntersectionObserver = ({
  threshold = 0.1,
  root = null,
  rootMargin = '0px',
} = {}) => {
  const [isVisible, setVisible] = useState(false);
  const [entry, setEntry] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entryResult]) => {
        setVisible(entryResult.isIntersecting);
        setEntry(entryResult);
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold, root, rootMargin]);

  return [ref, isVisible, entry];
};

/**
 * Hook to detect when an element enters the viewport and run a callback
 * @param {Function} callback - Function to run when element enters viewport
 * @param {Object} options - IntersectionObserver options
 * @returns {Function} - Ref to attach to the element
 */
export const useIntersectionCallback = (callback, options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const currentElement = ref.current;
    if (!currentElement || !callback) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback(entry);
        if (options.once) {
          observer.unobserve(currentElement);
        }
      }
    }, options);

    observer.observe(currentElement);
    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, [callback, options]);

  return ref;
};