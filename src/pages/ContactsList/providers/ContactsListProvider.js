import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import PropTypes from "prop-types";

import useFetchTableData from "../hooks/useFetchTableData";
import usePolicyCount from "../hooks/usePolicyCount";
import useArrayMerger from "../hooks/useArrayMerger";

import Spinner from "components/ui/Spinner/index";
import { filterSectionsConfig as filterSectionsConfigOriginal } from "packages/ContactListFilterOptionsV2/FilterSectionsConfig";

const DEFAULT_PAGE_ITEM = 12;
const DEFAULT_SORT = ["createDate:desc"];
const CARD_PATH = "/contacts/card";

const ContactsListContext = createContext(null);

export const ContactsListProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [layout, setLayout] = useState(false);
    const [sort, setSort] = useState(DEFAULT_SORT);
    const [searchString, setSearchString] = useState(null);
    const [withoutFilterResponseSize, setWithoutFilterResponseSize] = useState(null);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_ITEM);
    const [filterSectionsConfig, setFilterSectionsConfigOriginal] = useState(
        JSON.parse(localStorage.getItem("contactList_filterSectionsConfig")) || filterSectionsConfigOriginal
    );
    const [pageIndex, setPageIndex] = useState(1);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [fetchedFiltersSectionConfigFromApi, setFetchedFiltersSectionConfigFromApi] = useState(false);
    const [selectedFilterSections, setSelectedFilterSectionsState] = useState(
        JSON.parse(localStorage.getItem("contactList_selectedFilterSections") || JSON.stringify([]))
    );

    const setFilterSectionsConfig = useCallback(
        (newValue) => {
            setFilterSectionsConfigOriginal(newValue);
            localStorage.setItem("contactList_filterSectionsConfig", JSON.stringify(newValue));
        },
        [setFilterSectionsConfigOriginal]
    );

    const setSelectedFilterSections = useCallback(
        (filters) => {
            setSelectedFilterSectionsState(filters);
            localStorage.setItem("contactList_selectedFilterSections", JSON.stringify(filters));
        },
        [setSelectedFilterSectionsState]
    );

    const location = useLocation();
    const {
        tableData,
        isLoading: isfetchingTableData,
        fetchTableData,
        allLeads,
        fetchTableDataWithoutFilters,
        pageResult,
    } = useFetchTableData();
    const { policyCounts, isLoading: loadingPolicyCount } = usePolicyCount(allLeads);
    const mergedData = useArrayMerger(policyCounts, tableData);

    const fetchAllListCount = useCallback(async () => {
        if (!withoutFilterResponseSize) {
            const total = await fetchTableDataWithoutFilters({
                pageIndex: 1,
                pageSize: DEFAULT_PAGE_ITEM,
                searchString: null,
                sort: DEFAULT_SORT,
            });
            setWithoutFilterResponseSize(total);
        }
    }, [withoutFilterResponseSize, setFetchedFiltersSectionConfigFromApi, fetchTableDataWithoutFilters]);

    const refreshData = useCallback(() => {
        fetchTableData({
            pageIndex: 1,
            pageSize,
            searchString,
            sort,
            selectedFilterSections,
            filterSectionsConfig,
            isSilent: true,
        });
    }, [fetchTableData, pageSize, searchString, sort, selectedFilterSections, filterSectionsConfig]);

    const fetchSilently = useCallback(
        (_pageSize) => {
            fetchTableData({
                pageSize: _pageSize,
                pageIndex,
                searchString,
                sort,
                isSilent: true,
                selectedFilterSections,
                filterSectionsConfig,
            });
        },
        [fetchTableData, pageIndex, searchString, sort, selectedFilterSections, filterSectionsConfig]
    );

    const resetData = useCallback(
        (newSelectedFilterSections) => {
            fetchAllListCount();
            setPageSize(DEFAULT_PAGE_ITEM);
            setPageIndex(1);
            setSort(DEFAULT_SORT);
            setSearchString(null);
            setSelectedContacts([]);
            fetchTableData({
                pageIndex: 1,
                pageSize: DEFAULT_PAGE_ITEM,
                searchString: null,
                sort: DEFAULT_SORT,
                selectedFilterSections: newSelectedFilterSections,
                filterSectionsConfig,
                isSilent: true,
            });
        },
        [fetchTableData, fetchAllListCount, filterSectionsConfig]
    );

    const contextValue = useMemo(
        () => ({
            tableData: mergedData,
            fetchTableData,
            withoutFilterResponseSize,
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
            selectedFilterSections,
            setSelectedFilterSections,
            filterSectionsConfig,
            setFilterSectionsConfig,
            fetchedFiltersSectionConfigFromApi,
            setFetchedFiltersSectionConfigFromApi,
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
            withoutFilterResponseSize,
            pageResult,
            fetchSilently,
            policyCounts,
            selectedFilterSections,
            setSelectedFilterSections,
            filterSectionsConfig,
            setFilterSectionsConfig,
            fetchedFiltersSectionConfigFromApi,
            setFetchedFiltersSectionConfigFromApi,
        ]
    );

    useEffect(() => {
        if (location.pathname.includes("/contacts")) {
            fetchAllListCount();
            fetchTableData({
                pageSize,
                pageIndex,
                searchString,
                sort,
                selectedFilterSections,
                filterSectionsConfig,
                isSilent: true,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchTableData, fetchAllListCount, searchString, location.search, pageIndex, sort]);

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
