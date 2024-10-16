import * as Sentry from "@sentry/react";
import { useCallback, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import useToast from "hooks/useToast";

import { useClientServiceContext } from "services/clientServiceProvider";

function useFetchCampaignLeads() {
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [allLeads, setAllLeads] = useState([]);
    const showToast = useToast();
    const location = useLocation();
    const { clientsService } = useClientServiceContext();
    const [filteredEligibleCount, setFilteredEligibleCount] = useState(0);

    const queryParams = useMemo(() => {
        return new URLSearchParams(location.search);
    }, [location.search]);

    const applyFilters = useMemo(() => {
        const stages = queryParams.get("Stage");
        const tags = queryParams.get("Tags");
        const contactRecordType = queryParams.get("ContactRecordType");
        const hasReminder = queryParams.get("HasReminder");
        const hasOverdueReminder = queryParams.get("HasOverdueReminder");
        return {
            contactRecordType,
            hasReminder,
            stages: stages ? stages.split(",") : [],
            tags: tags ? tags.split(",") : [],
            hasOverdueReminder,
        };
    }, [queryParams]);

    const fetchTableDataWithoutFilters = useCallback(
        async ({ sort, searchString, returnAll, searchId, statusOptionsMap, actionOrderedId }) => {
            const response = await clientsService.getCampaignLeads(
                sort,
                searchString,
                returnAll,
                null,
                searchId,
                null,
                statusOptionsMap,
                actionOrderedId
            );
            const total = response.totalContactCount;
            const eligibleContactsLength = response?.eligibleContacts?.length;
            const leadsList = response?.eligibleContacts || [];
            const leadIdsList = response?.eligibleContacts?.map((contact) => contact.leadsId) || [];
            return {
                total,
                leadsList,
                leadIdsList,
                eligibleContactsLength,
            };
        },
        [applyFilters]
    );

    const fetchTableData = useCallback(
        async ({
            sort,
            searchString,
            returnAll,
            isSilent,
            selectedFilterSections,
            searchId,
            filterId,
            statusOptionsMap,
        }) => {
            try {
                if (!isSilent && !selectedFilterSections?.length) {
                    setIsLoading(true);
                }

                const response = await clientsService.getCampaignLeads(
                    sort,
                    searchString,
                    returnAll,
                    selectedFilterSections,
                    searchId,
                    filterId,
                    statusOptionsMap
                );

                setTableData(response?.eligibleContacts);
                setAllLeads(response?.eligibleContacts?.map((contact) => contact.leadsId));
                setFilteredEligibleCount(response?.totalContactCount);
                setIsLoading(false);
                return {
                    tableData: response?.eligibleContacts,
                    filteredEligibleCount: response?.totalContactCount,
                };
            } catch (error) {
                setIsLoading(false);
                Sentry.captureException(error);
                showToast({
                    type: "error",
                    message: "Failed to load data",
                    time: 10000,
                });
            }
        },
        [showToast, applyFilters]
    );

    return {
        tableData,
        isLoading: isLoading,
        fetchTableData,
        fetchTableDataWithoutFilters,
        allLeads,
        filteredEligibleCount,
    };
}

export default useFetchCampaignLeads;
