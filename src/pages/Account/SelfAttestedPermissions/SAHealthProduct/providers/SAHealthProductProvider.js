import { createContext, useContext, useMemo, useState } from "react";

import useFetchAgentsData from "../hooks/useFetchAgentsData";
import useFetchTableData from "../hooks/useFetchTableData";
import useFilterOptions from "../hooks/useFilterOptions";
import useFilterData from "../hooks/useFilteredData";
import useShowSection from "../hooks/useShowSection";

import Spinner from "components/ui/Spinner/index";

// Create a context for SAHealthProductProvider
const SAHealthProductContext = createContext(null);

export const SAHealthProductProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    // -- For Table related features
    const { agents, isLoading: isFetchingAgentsData } = useFetchAgentsData();
    const { tableData, isLoading: isfetchingTableData, fetchTableData } = useFetchTableData();

    // -- For Filter related features
    const [openFilter, setOpenFilter] = useState(false);
    const { setFilters, filteredData, filters } = useFilterData(tableData);
    const { filterOptions } = useFilterOptions(tableData);

    const shouldShowSection = useShowSection(agents);

    // Memoize the context value using useMemo
    const contextValue = useMemo(
        () => ({
            agents,
            tableData,
            filterOptions,
            filters,
            filteredData,
            openFilter,
            setFilters,
            setOpenFilter,
            fetchTableData,
            setIsLoading,
        }),
        [
            agents,
            tableData,
            filterOptions,
            filters,
            filteredData,
            openFilter,
            setFilters,
            setOpenFilter,
            fetchTableData,
            setIsLoading,
        ]
    );

    if (isFetchingAgentsData || isfetchingTableData || isLoading) {
        return <Spinner />;
    }

    if (!shouldShowSection) {
        return <></>;
    }

    return <SAHealthProductContext.Provider value={contextValue}>{children}</SAHealthProductContext.Provider>;
};

// Custom hook to access SAHealthProductContext
export const useSAHealthProductContext = () => {
    const context = useContext(SAHealthProductContext);

    if (context === undefined) {
        throw new Error("useSAHealthProductContext must be used within SAHealthProductProvider");
    }

    return context;
};
