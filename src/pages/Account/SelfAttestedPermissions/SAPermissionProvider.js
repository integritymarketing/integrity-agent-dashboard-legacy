import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

import Spinner from "components/ui/Spinner/index";
import useFeatureFlag from "hooks/useFeatureFlag";
import useFetchTableData from "./hooks/useFetchTableData";
import useFetchAgentsData from "./hooks/useFetchAgentsData";
import useFilterData from "./hooks/useFilteredData";
import useFilterOptions from "./hooks/useFilterOptions";

const FLAG_NAME = "REACT_APP_SELF_ATTESTED_PERMISSION_FLAG";

// Create a context for SAPermissionsProvider
const SAPermissionsContext = createContext(null);

export const SAPermissionsProvider = ({ children }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // -- 
  const { agents, isLoading } = useFetchAgentsData();
  const {
    tableData,
    isLoading: isfetchingTableData,
    fetchTableData,
  } = useFetchTableData();
  const isFeatureEnabled = useFeatureFlag(FLAG_NAME);

  // -- For Filter related features
  const [openFilter, setOpenFilter] = useState(false);
  const { setFilters, filteredData, filters } = useFilterData(tableData);
  const { filterOptions } = useFilterOptions(tableData);

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
      setIsAdding,
      isCollapsed,
      setIsCollapsed,
      isModalOpen,
      setIsModalOpen,
      agents,
      tableData,
      fetchTableData,
      filterOptions,
      setFilters,
      filters,
      filteredData,
      handleAddNew,
      handleCancel,
      openFilter,
      setOpenFilter,
    }),
    [
      isAdding,
      setIsAdding,
      isCollapsed,
      setIsCollapsed,
      isModalOpen,
      setIsModalOpen,
      agents,
      tableData,
      fetchTableData,
      filterOptions,
      setFilters,
      filters,
      filteredData,
      handleAddNew,
      handleCancel,
      openFilter,
      setOpenFilter
    ]
  );

  if (!isFeatureEnabled) return <></>;

  if (isLoading || isfetchingTableData) return <Spinner />;

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
