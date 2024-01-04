import { createContext, useContext, useMemo, useState } from "react";

import useFetchLifeAgentData from "../hooks/useFetchLifeAgentData";

import Spinner from "components/ui/Spinner/index";

// Create a context for APLifeProvider
const APLifeContext = createContext(null);

// eslint-disable-next-line react/prop-types
export const APLifeProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { tableData, isLoading: isfetchingTableData, fetchTableData } = useFetchLifeAgentData();

    // Memoize the context value using useMemo
    const contextValue = useMemo(
        () => ({
            tableData,
            fetchTableData,
            setIsLoading,
        }),
        [tableData, fetchTableData]
    );

    if (isfetchingTableData || isLoading) {
        return <Spinner />;
    }

    return <APLifeContext.Provider value={contextValue}>{children}</APLifeContext.Provider>;
};

// Custom hook to access APLifeContext
export const useAPLifeContext = () => {
    const context = useContext(APLifeContext);

    if (context === undefined) {
        throw new Error("useAPLifeContext must be used within APLifeProvider");
    }

    return context;
};
