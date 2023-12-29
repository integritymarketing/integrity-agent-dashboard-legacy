import { createContext, useCallback, useContext, useMemo, useState } from "react";

// Create a context for SAPermissionsProvider
const SAPermissionsContext = createContext(null);

// eslint-disable-next-line react/prop-types
export const SAPermissionsProvider = ({ children }) => {
    const [isAddingHealth, setIsAddingHealth] = useState(false);
    const [isAddingLife, setIsAddingLife] = useState(false);

    const handleAddHealth = useCallback(() => {
        setIsAddingHealth(true);
    }, [setIsAddingHealth]);

    const handleCancelHealth = useCallback(() => {
        setIsAddingHealth(false);
    }, [setIsAddingHealth]);

    const handleAddLife = useCallback(() => {
        setIsAddingLife(true);
    }, [setIsAddingLife]);

    const handleCancelLife = useCallback(() => {
        setIsAddingLife(false);
    }, [setIsAddingLife]);

    const resetAdding = useCallback(() => {
        setIsAddingLife(false);
        setIsAddingHealth(false);
    }, [setIsAddingLife]);

    // Memoize the context value using useMemo
    const contextValue = useMemo(
        () => ({
            isAddingHealth,
            isAddingLife,
            handleCancelHealth,
            handleAddHealth,
            handleAddLife,
            handleCancelLife,
            resetAdding,
        }),
        [
            isAddingHealth,
            isAddingLife,
            handleCancelHealth,
            handleAddHealth,
            handleAddLife,
            handleCancelLife,
            resetAdding,
        ]
    );

    return <SAPermissionsContext.Provider value={contextValue}>{children}</SAPermissionsContext.Provider>;
};

// Custom hook to access SAPermissionsContext
export const useSAPermissionsContext = () => {
    const context = useContext(SAPermissionsContext);

    if (context === undefined) {
        throw new Error("useSAPermissionsContext must be used within SAPermissionsProvider");
    }

    return context;
};
