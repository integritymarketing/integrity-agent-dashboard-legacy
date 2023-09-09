import { useCallback } from 'react';

/**
 * Custom hook for analytics functionalities.
 *
 * @returns {Object} An object containing methods for analytics.
 */

const useAnalytics = () => {

  const clickClass = useCallback((id) => {
    return `gtm-${id}`;
  }, []);

  const fireEvent = useCallback((event, details = {}) => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event,
        ...details,
      });
    }
  }, []);
  
  return {
    clickClass,
    fireEvent,
  };
};

export default useAnalytics;
