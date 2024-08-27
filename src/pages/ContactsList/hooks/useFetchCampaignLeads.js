import * as Sentry from "@sentry/react";
import { useCallback, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import useToast from "hooks/useToast";

import { useClientServiceContext } from "services/clientServiceProvider";

function useFetchCampaignLeads() {
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [allLeads, setAllLeads] = useState([]);
    const [pageResult, setPageResult] = useState(null);
    const showToast = useToast();
    const location = useLocation();
    const { clientsService } = useClientServiceContext();

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
        async ({ pageIndex, pageSize, sort, searchString, returnAll, campaignId }) => {
            const response = await clientsService.getCampaignLeads(
                pageIndex,
                pageSize,
                sort,
                searchString,
                returnAll,
                null,
                null,
                campaignId
            );
            const total = response.length;
            const leadsList = response || [];
            const leadIdsList = response?.map((contact) => contact.leadsId) || [];
            return {
                total,
                leadsList,
                leadIdsList,
            };
        },
        [applyFilters]
    );

    const fetchTableData = useCallback(
        async ({
            pageIndex,
            pageSize,
            sort,
            searchString,
            returnAll,
            isSilent,
            selectedFilterSections,
            filterSectionsConfig,
            campaignId,
            filterId,
        }) => {
            try {
                if (!isSilent && !selectedFilterSections?.length) {
                    setIsLoading(true);
                }

                const response = await clientsService.getCampaignLeads(
                    pageIndex,
                    pageSize,
                    sort,
                    searchString,
                    returnAll,
                    selectedFilterSections,
                    filterSectionsConfig,
                    campaignId,
                    filterId
                );

                setTableData(response);
                setAllLeads(response?.map((contact) => contact.leadsId));

                setIsLoading(false);
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

    return { tableData, isLoading: isLoading, fetchTableData, fetchTableDataWithoutFilters, allLeads, pageResult };
}

export default useFetchCampaignLeads;
