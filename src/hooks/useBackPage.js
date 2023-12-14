import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Custom hook to navigate back in the browser history or to a specified fallback route.
 * 
 * @param {string} fallbackRoute - The route to navigate to if there is no history to go back to. Defaults to '/'.
 * @returns {Function} A function that, when called, navigates back in history or to the fallback route.
 */

const useBackPage = (fallbackRoute = '/') => {
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * Navigates back in the browser history or to the fallback route.
     * If the current path remains unchanged after a short delay, it navigates to the fallback route.
     */
    
    const handleBackPage = useCallback(() => {
        const currentPath = location.pathname;
        navigate(-1);

        setTimeout(() => {
            if (window.location.pathname === currentPath) {
                navigate(fallbackRoute);
            }
        }, 100);
    }, [navigate, location.pathname, fallbackRoute]);

    return handleBackPage;
};

export default useBackPage;
