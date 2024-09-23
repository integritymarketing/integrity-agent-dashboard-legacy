import { useState, useEffect } from "react";
import * as Sentry from "@sentry/react";

/**
 * Custom hook to manage state with localStorage or sessionStorage.
 *
 * @param {string} key - The key to store the value under in storage.
 * @param {*} initialValue - The initial value to use if the key is not found in storage.
 * @param {"local" | "session"} [storageType="local"] - The type of storage to use ("local" for localStorage, "session" for sessionStorage).
 * @returns {[any, Function]} - Returns the stored value and a function to update it.
 */

const useStorage = (key, initialValue, storageType = "local") => {
    const storage = storageType === "session" ? window.sessionStorage : window.localStorage;

    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = storage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            Sentry.captureException(error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            storage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            Sentry.captureException(error);
        }
    }, [key, storedValue, storage]);

    const setValue = (value) => {
        try {
            setStoredValue(value);
        } catch (error) {
            Sentry.captureException(error);
        }
    };

    return [storedValue, setValue];
};

export default useStorage;
