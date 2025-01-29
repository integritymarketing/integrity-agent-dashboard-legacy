import { createContext, useContext, useMemo, useState } from "react";

import useRoles from "hooks/useRoles";

// Create a context for AccountProductsProvider
const AccountProductsContext = createContext(null);

export const HEALTH = "HEALTH";
export const LIFE = "LIFE";

// eslint-disable-next-line react/prop-types
export const AccountProductsProvider = ({ children }) => {
    const { isNonRTS_User } = useRoles();
    const [layout, setLayout] = useState(isNonRTS_User ? LIFE : HEALTH);

    // Memoize the context value using useMemo
    const contextValue = useMemo(() => ({ layout, setLayout }), [layout]);

    return <AccountProductsContext.Provider value={contextValue}>{children}</AccountProductsContext.Provider>;
};

// Custom hook to access AccountProductsContext
export const useAccountProductsContext = () => {
    const context = useContext(AccountProductsContext);

    if (context === undefined) {
        throw new Error("useAccountProductsContext must be used within AccountProductsProvider");
    }

    return context;
};
