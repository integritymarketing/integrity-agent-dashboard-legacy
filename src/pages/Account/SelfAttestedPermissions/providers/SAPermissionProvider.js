import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

// Create a context for SAPermissionsProvider
const SAPermissionsContext = createContext(null);

export const SAPermissionsProvider = ({ children }) => {
    const [isAddingHealth, setIsAddingHealth] = useState(false);

    const handleAddHealth = useCallback(() => {
        setIsAddingHealth(true);
    }, [setIsAddingHealth]);

    const handleCancelHealth = useCallback(() => {
        setIsAddingHealth(false);
    }, [setIsAddingHealth]);

    // Memoize the context value using useMemo
    const contextValue = useMemo(
        () => ({
            isAddingHealth,
            handleCancelHealth,
            handleAddHealth,
        }),
        [isAddingHealth, handleCancelHealth, handleAddHealth]
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
