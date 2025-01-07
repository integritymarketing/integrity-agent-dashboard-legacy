import { useEffect } from "react";

/**
 * Hook that calls a handler function when a click event happens outside of the given ref element
 * or when the Escape key is pressed.
 * @param {React.RefObject} ref - A React ref object to the target element.
 * @param {Function} handler - A function to execute when a click event occurs outside of the ref element
 * or when the Escape key is pressed.
 */
export const useOnClickOutside = (ref, handler) => {
    useEffect(() => {
        const listener = (event) => {
            // Do nothing if clicking ref's element or descendent elements
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }

            // Call the handler if clicking outside of the ref element
            handler && handler(event);
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                handler && handler(event);
            }
        };

        // Add event listeners for mousedown, touchstart, and keydown events
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        document.addEventListener("keydown", handleKeyDown);

        // Cleanup event listeners
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [ref, handler]); // Re-run the effect if ref or handler changes
};
