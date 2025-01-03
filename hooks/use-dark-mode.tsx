import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

/**
 * Custom hook to detect and return whether dark mode is enabled.
 * @returns {boolean} - True if dark mode is enabled, otherwise false.
 */
const useDarkMode = (): boolean => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    // Check if window is available (to avoid SSR issues in Next.js)
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      // Set the initial state based on the media query
      setIsDarkMode(mediaQuery.matches);

      // Listener to update state when preference changes
      const handleChange = (e: MediaQueryListEvent) => {
        const hasDarkMode = theme === 'system' ? e.matches : theme === 'dark';
        setIsDarkMode(hasDarkMode);
      };

      mediaQuery.addEventListener('change', handleChange);

      // Cleanup listener on unmount
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') {
      setIsDarkMode(theme === 'dark');
    }
  }, [theme])
  

  
  return isDarkMode;
};

export default useDarkMode;