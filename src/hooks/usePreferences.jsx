import { useEffect, useState } from "react";

/**
 * A hook to manage user preferences using the browser's sessionStorage
 *
 * @param {any} defaultValue - The default value for the preference
 * @param {string} key - The key under which the preference is stored in sessionStorage
 * @returns {Array} - An array containing the value and a function to update it
 */
function usePreferences(defaultValue, key) {
    // initialize the state from sessionStorage or use the default value
    const [value, setValue] = useState(() => {
        const storedValue = window.sessionStorage.getItem(key);
        // If the stored value is not null, parse it as JSON and return i
        if (storedValue !== null && storedValue !== "undefined") {
            return JSON.parse(storedValue);
        }
        // Otherwise, store the default value in sessionStorage and return it
        window.sessionStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
    });

    // When the value changes, update sessionStorage with the new value
    useEffect(() => {
        window.sessionStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}

export default usePreferences;
