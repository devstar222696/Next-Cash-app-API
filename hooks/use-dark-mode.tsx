import { useState, useEffect } from 'react';

/**
 * Custom hook to detect and return whether dark mode is enabled.
 * @returns {boolean} - True if dark mode is enabled, otherwise false.
 */
const useDarkMode = (): boolean => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if window is available (to avoid SSR issues in Next.js)
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      // Set the initial state based on the media query
      setIsDarkMode(mediaQuery.matches);

      // Listener to update state when preference changes
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);

      // Cleanup listener on unmount
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  return isDarkMode;
};

export default useDarkMode;