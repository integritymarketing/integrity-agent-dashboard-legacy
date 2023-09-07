import { useEffect } from 'react';

/**
 * Hook that calls a handler function when a click event happens outside of the given ref element.
 * @param {React.RefObject} ref - A React ref object to the target element.
 * @param {Function} handler - A function to execute when a click event occurs outside of the ref element.
 */
export const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = event => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      // Call the handler if clicking outside of the ref element
      handler && handler(event);
    };

    // Add event listeners for mousedown and touchstart events
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    // Cleanup event listeners
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]); // Re-run the effect if ref or handler changes
};
