import { useState, useEffect } from "react";

/**
 * A hook to manage user preferences using the browser's localStorage
 *
 * @param {any} defaultValue - The default value for the preference
 * @param {string} key - The key under which the preference is stored in localStorage
 * @returns {Array} An array containing two items: the current value of the preference, and a function to set that value
 */
function usePreferences(defaultValue, key) {
  // initialize the state from localStorage or use the default value
  const [value, setValue] = useState(() => {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue);
    }
    window.localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  });

  // When the value changes, update localStorage
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default usePreferences;
