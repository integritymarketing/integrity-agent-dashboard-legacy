import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

import Spinner from "components/ui/Spinner/index";
import useFetchTableData from "../hooks/useFetchTableData";
import useFetchAgentsData from "../hooks/useFetchAgentsData";
import useFilterData from "../hooks/useFilteredData";
import useFilterOptions from "../hooks/useFilterOptions";
import useShowSection from "../hooks/useShowSection";

// Create a context for SAPermissionsProvider
const SAPermissionsContext = createContext(null);

export const SAPermissionsProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // -- For Table related features
  const { agents, isLoading: isFetchingAgentsData } = useFetchAgentsData();
  const {
    tableData,
    isLoading: isfetchingTableData,
    fetchTableData,
  } = useFetchTableData();

  // -- For Filter related features
  const [openFilter, setOpenFilter] = useState(false);
  const { setFilters, filteredData, filters } = useFilterData(tableData);
  const { filterOptions } = useFilterOptions(tableData);

  const shouldShowSection = useShowSection(agents);

  const handleAddNew = useCallback(() => {
    setIsAdding(true);
  }, [setIsAdding]);

  const handleCancel = useCallback(() => {
    setIsAdding(false);
  }, [setIsAdding]);

  // Memoize the context value using useMemo
  const contextValue = useMemo(
    () => ({
      isAdding,
      isCollapsed,
      agents,
      tableData,
      filterOptions,
      filters,
      filteredData,
      openFilter,
      setIsAdding,
      setIsCollapsed,
      setFilters,
      setOpenFilter,
      handleAddNew,
      handleCancel,
      fetchTableData,
      setIsLoading,
    }),
    [
      isAdding,
      isCollapsed,
      agents,
      tableData,
      filterOptions,
      filters,
      filteredData,
      openFilter,
      setIsAdding,
      setIsCollapsed,
      setFilters,
      setOpenFilter,
      handleAddNew,
      handleCancel,
      fetchTableData,
      setIsLoading,
    ]
  );

  if (!shouldShowSection) return <></>;

  if (isFetchingAgentsData || isfetchingTableData || isLoading)
    return <Spinner />;

  return (
    <SAPermissionsContext.Provider value={contextValue}>
      {children}
    </SAPermissionsContext.Provider>
  );
};

// Custom hook to access SAPermissionsContext
export const useSAPermissionsContext = () => {
  const context = useContext(SAPermissionsContext);

  if (context === undefined) {
    throw new Error(
      "useSAPermissionsContext must be used within SAPermissionsProvider"
    );
  }

  return context;
};
