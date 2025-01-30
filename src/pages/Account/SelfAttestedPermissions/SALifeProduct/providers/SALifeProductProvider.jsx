import { createContext, useContext, useMemo, useState } from "react";

import useCarrierOptions from "../hooks/useCarrierOptions";
import useFetchTableData from "../hooks/useFetchTableData";

import Spinner from "components/ui/Spinner/index";

// Create a context for SALifeProductProvider
const SALifeProductContext = createContext(null);

// eslint-disable-next-line react/prop-types
export const SALifeProductProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { tableData, isLoading: isfetchingTableData, fetchTableData } = useFetchTableData();
    const { options, error: getCarrierError, originals, fetchCarriesData } = useCarrierOptions();

    const hasError = getCarrierError || error;

    // Memoize the context value using useMemo
    const contextValue = useMemo(
        () => ({
            tableData,
            fetchTableData,
            setIsLoading,
            error: hasError,
            setError,
            options,
            originals,
            fetchCarriesData,
        }),
        [tableData, fetchTableData, options, hasError, originals, fetchCarriesData]
    );

    if (isfetchingTableData || isLoading) {
        return <Spinner />;
    }

    return <SALifeProductContext.Provider value={contextValue}>{children}</SALifeProductContext.Provider>;
};

// Custom hook to access SALifeProductContext
export const useSALifeProductContext = () => {
    const context = useContext(SALifeProductContext);

    if (context === undefined) {
        throw new Error("useSALifeProductContext must be used within SALifeProductProvider");
    }

    return context;
};
