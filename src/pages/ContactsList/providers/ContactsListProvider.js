import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import PropTypes from "prop-types";
import * as Sentry from "@sentry/react";

import useFetchTableData from "../hooks/useFetchTableData";

import Spinner from "components/ui/Spinner/index";
import { filterSectionsConfig as filterSectionsConfigOriginal } from "packages/ContactListFilterOptionsV2/FilterSectionsConfig";
import useFilteredLeadIds from "pages/ContactsList/hooks/useFilteredLeadIds";

const DEFAULT_PAGE_SIZE = 12;
const MAP_DEFAULT_PAGE_SIZE = 50;
const INITIAL_PAGE_NUMBER = 1;
const DEFAULT_SORT = ["createDate:desc"];


const ContactsListContext = createContext(null);

export const ContactsListProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [layout, setLayout] = useState(false);
    const [sort, setSort] = useState(DEFAULT_SORT);
    const [searchString, setSearchString] = useState(null);
    const [withoutFilterResponseSize, setWithoutFilterResponseSize] = useState(null);
    const [filterSectionsConfig, setFilterSectionsConfigOriginal] = useState(
        JSON.parse(localStorage.getItem("contactList_filterSectionsConfig")) || filterSectionsConfigOriginal
    );
    const [pageIndex, setPageIndex] = useState(INITIAL_PAGE_NUMBER);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [filterConditions, setFilterConditions] = useState();
    const [fetchedFiltersSectionConfigFromApi, setFetchedFiltersSectionConfigFromApi] = useState(false);
    const [selectedFilterSections, setSelectedFilterSectionsState] = useState(
        JSON.parse(localStorage.getItem("contactList_selectedFilterSections") || JSON.stringify([]))
    );
    const { removeFilteredLeadIds, filteredInfo } = useFilteredLeadIds();

    const setFilterSectionsConfig = useCallback(
        (newValue) => {
            setFilterSectionsConfigOriginal(newValue);
            localStorage.setItem("contactList_filterSectionsConfig", JSON.stringify(newValue));
        },
        [setFilterSectionsConfigOriginal],
    );

    const setSelectedFilterSections = useCallback(
        (filters) => {
            setSelectedFilterSectionsState(filters);
            localStorage.setItem("contactList_selectedFilterSections", JSON.stringify(filters));
        },
        [setSelectedFilterSectionsState],
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

    const fetchAllListCount = useCallback(async () => {
        try {
            if (!withoutFilterResponseSize) {
                const response = await fetchTableDataWithoutFilters({
                    pageIndex: INITIAL_PAGE_NUMBER,
                    pageSize: layout == "map" ? MAP_DEFAULT_PAGE_SIZE : DEFAULT_PAGE_SIZE,
                    searchString,
                    sort: DEFAULT_SORT,
                });
                setWithoutFilterResponseSize(response?.total);
            }
        } catch (error) {
            Sentry.captureException(error); // Log the error to Sentry
            console.error("Failed to fetch all leads count", error); // Local logging
        }
    }, [searchString, withoutFilterResponseSize, fetchTableDataWithoutFilters, layout]);

    const refreshData = useCallback(() => {
        fetchTableData({
            pageIndex: INITIAL_PAGE_NUMBER,
            pageSize: layout == "map" ? MAP_DEFAULT_PAGE_SIZE : DEFAULT_PAGE_SIZE,
            searchString,
            sort,
            selectedFilterSections,
            filterSectionsConfig,
            isSilent: true,
        });
    }, [fetchTableData, searchString, sort, selectedFilterSections, filterSectionsConfig]);

    const fetchMoreContactsByPage = useCallback(async () => {
        try {
            const nextPage = pageIndex + 1;
            await fetchTableData({
                pageSize: layout == "map" ? MAP_DEFAULT_PAGE_SIZE : DEFAULT_PAGE_SIZE,
                pageIndex: nextPage,
                searchString,
                sort,
                isSilent: true,
                selectedFilterSections,
                filterSectionsConfig,
                appendData: true,
            });
            setPageIndex(nextPage);
        } catch (error) {
            Sentry.captureException(error);
            console.error("Failed to fetch more contacts", error);
        }
    }, [fetchTableData, pageIndex, searchString, sort, selectedFilterSections, filterSectionsConfig]);

    const resetData = useCallback(
        (newSelectedFilterSections) => {
            if (filteredInfo?.status) {
                removeFilteredLeadIds();
                setWithoutFilterResponseSize(null);
            }
            fetchAllListCount();
            setSelectedContacts([]);
            fetchTableData({
                pageIndex: INITIAL_PAGE_NUMBER,
                pageSize: layout == "map" ? MAP_DEFAULT_PAGE_SIZE : DEFAULT_PAGE_SIZE,
                searchString,
                sort: DEFAULT_SORT,
                selectedFilterSections: newSelectedFilterSections,
                filterSectionsConfig,
                isSilent: true,
            });
        },
        [fetchAllListCount, fetchTableData, searchString, filterSectionsConfig],
    );

    const contextValue = useMemo(
        () => ({
            tableData,
            fetchTableData,
            withoutFilterResponseSize,
            setWithoutFilterResponseSize,
            setIsLoading,
            searchString,
            setSearchString,
            fetchMoreContactsByPage,
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
            selectedFilterSections,
            setSelectedFilterSections,
            filterSectionsConfig,
            setFilterSectionsConfig,
            fetchedFiltersSectionConfigFromApi,
            setFetchedFiltersSectionConfigFromApi,
            filterConditions,
            setFilterConditions,
        }),
        [
            tableData,
            fetchTableData,
            searchString,
            sort,
            layout,
            resetData,
            selectedContacts,
            allLeads,
            refreshData,
            withoutFilterResponseSize,
            pageResult,
            fetchMoreContactsByPage,
            selectedFilterSections,
            setSelectedFilterSections,
            filterSectionsConfig,
            setFilterSectionsConfig,
            fetchedFiltersSectionConfigFromApi,
            setFetchedFiltersSectionConfigFromApi,
        ],
    );

    useEffect(() => {
        if (location.pathname.includes("/contacts") && layout) {
            fetchAllListCount();
            fetchTableData({
                pageSize: layout == "map" ? MAP_DEFAULT_PAGE_SIZE : DEFAULT_PAGE_SIZE,
                pageIndex: INITIAL_PAGE_NUMBER,
                searchString,
                sort,
                selectedFilterSections,
                filterSectionsConfig,
                isSilent: true,
            })
                .then(() => {
                    setPageIndex(INITIAL_PAGE_NUMBER);
                })
                .catch((error) => {
                    Sentry.captureException(error);
                    console.error("Error during initial fetch", error);
                });
        }
    }, [fetchTableData, searchString, location.search, sort, layout]);

    if (isfetchingTableData || isLoading) {
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
