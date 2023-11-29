import { createContext, useContext, useMemo, useState } from "react";

// Create a context for ActivePermissionsProvider
const ActivePermissionsContext = createContext(null);

export const HEALTH = "HEALTH";
export const LIFE = "LIFE";

// eslint-disable-next-line react/prop-types
export const ActivePermissionsProvider = ({ children }) => {
    const [layout, setLayout] = useState(HEALTH);

    // Memoize the context value using useMemo
    const contextValue = useMemo(() => ({ layout, setLayout }), [layout]);

    return <ActivePermissionsContext.Provider value={contextValue}>{children}</ActivePermissionsContext.Provider>;
};

// Custom hook to access ActivePermissionsContext
export const useActivePermissionsContext = () => {
    const context = useContext(ActivePermissionsContext);

    if (context === undefined) {
        throw new Error("useActivePermissionsContext must be used within ActivePermissionsProvider");
    }

    return context;
};
