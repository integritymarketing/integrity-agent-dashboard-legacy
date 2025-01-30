import { createContext, useContext, useMemo, useState } from "react";

import useFetchAgentsData from "../hooks/useFetchAgentsData";
import useFilterOptions from "../hooks/useFilterOptions";
import useFilterData from "../hooks/useFilteredData";
import useUniqueAgents from "../hooks/useUniqueAgents";

import Spinner from "components/ui/Spinner/index";

import { HEALTH, useActivePermissionsContext } from "./ActivePermissionsProvider";

// Create a context for APHealthProvider
const APHealthContext = createContext(null);

// eslint-disable-next-line react/prop-types
export const APHealthProvider = ({ children }) => {
    // -- For Table related features
    const { agents, isLoading: isFetchingAgentsData } = useFetchAgentsData();
    const { uniqueAgents } = useUniqueAgents(agents);

    // -- For Filter related features
    const [openFilter, setOpenFilter] = useState(false);
    const { setFilters, filteredData, filters } = useFilterData(uniqueAgents);
    const { filterOptions } = useFilterOptions(uniqueAgents);

    const { layout } = useActivePermissionsContext();

    // Memoize the context value using useMemo
    const contextValue = useMemo(
        () => ({ uniqueAgents, openFilter, setOpenFilter, setFilters, filteredData, filters, filterOptions }),
        [filterOptions, filteredData, filters, openFilter, setFilters, uniqueAgents]
    );

    if (layout !== HEALTH) {
        return <></>;
    }

    if (isFetchingAgentsData) {
        return <Spinner />;
    }

    return <APHealthContext.Provider value={contextValue}>{children}</APHealthContext.Provider>;
};

// Custom hook to access APHealthContext
export const useAPHealthContext = () => {
    const context = useContext(APHealthContext);

    if (context === undefined) {
        throw new Error("useSAHealthProductContext must be used within APHealthProvider");
    }

    return context;
};
