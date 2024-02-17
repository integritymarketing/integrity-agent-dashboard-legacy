import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import PropTypes from "prop-types";

import useFetchTableData from "../hooks/useFetchTableData";
import usePolicyCount from "../hooks/usePolicyCount";
import useArrayMerger from "../hooks/useArrayMerger";

import Spinner from "components/ui/Spinner/index";

const DEFAULT_PAGE_ITEM = 12;
const DEFAULT_SORT = ["Reminders%3Aasc&Sort=Reminders.ReminderDate%3Aasc", "createDate:desc"];
const CARD_PATH = "/contacts/card";

const ContactsListContext = createContext(null);

export const ContactsListProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [layout, setLayout] = useState(false);
    const [sort, setSort] = useState(DEFAULT_SORT);
    const [searchString, setSearchString] = useState(null);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_ITEM);
    const [pageIndex, setPageIndex] = useState(1);
    const [selectedContacts, setSelectedContacts] = useState([]);

    const location = useLocation();
    const { tableData, isLoading: isfetchingTableData, fetchTableData, allLeads, pageResult } = useFetchTableData();
    const { policyCounts, isLoading: loadingPolicyCount } = usePolicyCount(allLeads);
    const mergedData = useArrayMerger(policyCounts, tableData);

    const refreshData = useCallback(() => {
        fetchTableData({ pageIndex: 1, pageSize, searchString, sort });
    }, [fetchTableData, pageSize, searchString, sort]);

    const fetchSilently = useCallback(
        (_pageSize) => {
            fetchTableData({ pageSize: _pageSize, pageIndex, searchString, sort, isSilent: true });
        },
        [fetchTableData, pageIndex, searchString, sort]
    );

    const resetData = useCallback(() => {
        setPageSize(DEFAULT_PAGE_ITEM);
        setPageIndex(1);
        setSort(DEFAULT_SORT);
        setSearchString(null);
        setSelectedContacts([]);
        fetchTableData({ pageIndex: 1, pageSize: DEFAULT_PAGE_ITEM, searchString: null, sort: DEFAULT_SORT });
    }, [fetchTableData]);

    const contextValue = useMemo(
        () => ({
            tableData: mergedData,
            fetchTableData,
            setIsLoading,
            searchString,
            setSearchString,
            pageSize,
            fetchSilently,
            pageIndex,
            setPageIndex,
            sort,
            setSort,
            layout,
            setLayout,
            resetData,
            selectedContacts,
            setSelectedContacts,
            allLeads,
            refreshData,
            pageResult,
            setPageSize,
            policyCounts,
        }),
        [
            mergedData,
            fetchTableData,
            searchString,
            pageSize,
            pageIndex,
            sort,
            layout,
            resetData,
            selectedContacts,
            allLeads,
            refreshData,
            pageResult,
            fetchSilently,
            policyCounts,
        ]
    );

    useEffect(() => {
        if (location.pathname.includes("/contacts")) {
            fetchTableData({ pageSize, pageIndex, searchString, sort });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchTableData, searchString, location.search, pageIndex, sort]);

    useEffect(() => {
        setLayout(location.pathname === CARD_PATH ? "card" : "list");
    }, [location.pathname]);

    if (isfetchingTableData || isLoading || loadingPolicyCount) {
        return <Spinner />;
    }

    return <ContactsListContext.Provider value={contextValue}>{children}</ContactsListContext.Provider>;
};

ContactsListProvider.propTypes = {
    children: PropTypes.node,
};

// Custom hook to access ContactsListContext
export const useContactsListContext = () => {
    const context = useContext(ContactsListContext);

    if (context === undefined) {
        throw new Error("useContactsListContext must be used within ContactsListProvider");
    }

    return context;
};
