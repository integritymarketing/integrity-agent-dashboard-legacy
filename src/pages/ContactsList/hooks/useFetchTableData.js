import * as Sentry from "@sentry/react";
import { useCallback, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import useToast from "hooks/useToast";

import { useClientServiceContext } from "services/clientServiceProvider";

import { getAndResetItemFromLocalStorage } from "utils/shared-utils/sharedUtility";

function useFetchTableData() {
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
        async ({ pageIndex, pageSize, sort, searchString, returnAll }) => {
            const duplicateIds = getAndResetItemFromLocalStorage("duplicateLeadIds");
            const filterLeadIds = getAndResetItemFromLocalStorage("filterLeadIds");
            const leadIds = filterLeadIds ? filterLeadIds : duplicateIds ? duplicateIds : null;
            const response = await clientsService.getList(
                pageIndex,
                pageSize,
                sort,
                searchString,
                leadIds,
                applyFilters?.contactRecordType,
                applyFilters?.stages,
                applyFilters?.hasReminder,
                applyFilters.hasOverdueReminder,
                applyFilters.tags,
                returnAll
            );
            const total = response.pageResult.total || 0;
            const leadsList = response?.result || [];
            const leadIdsList = response?.result?.map((contact) => contact.leadsId) || [];
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
            appendData=false,
        }) => {
            try {
                if (!isSilent && !selectedFilterSections?.length) {
                    setIsLoading(true);
                }
                const duplicateIds = getAndResetItemFromLocalStorage("duplicateLeadIds");
                const filterLeadIds = getAndResetItemFromLocalStorage("filterLeadIds");
                const campaignsLeadIds = getAndResetItemFromLocalStorage("campaignsLeadIds");
                const leadIds = filterLeadIds
                    ? filterLeadIds
                    : duplicateIds
                    ? duplicateIds
                    : campaignsLeadIds
                    ? campaignsLeadIds
                    : null;
                let response;
                if (!selectedFilterSections?.length) {
                    setIsLoading(true);
                    response = await clientsService.getList(
                        pageIndex,
                        pageSize,
                        sort,
                        searchString,
                        leadIds,
                        applyFilters?.contactRecordType,
                        applyFilters?.stages,
                        applyFilters?.hasReminder,
                        applyFilters.hasOverdueReminder,
                        applyFilters.tags,
                        returnAll
                    );
                } else {
                    response = await clientsService.getContactListPost(
                        pageIndex,
                        pageSize,
                        sort,
                        searchString,
                        leadIds,
                        applyFilters?.contactRecordType,
                        applyFilters?.stages,
                        applyFilters?.hasReminder,
                        applyFilters.hasOverdueReminder,
                        applyFilters.tags,
                        returnAll,
                        selectedFilterSections,
                        filterSectionsConfig
                    );
                }
                const listData = response?.result.map((res) => ({
                    ...res,
                    contactRecordType:
                        (res.contactRecordType === "Client" || res.contactRecordType === "client") && !res.statusName
                            ? "Enrolled"
                            : res.contactRecordType,
                }));
                setPageResult(response?.pageResult);
                if(appendData){
                    setTableData((prevTableData) => [...(prevTableData || []), ...listData]);
                    if (listData && Array.isArray(listData)) {
                        setAllLeads((prevLeads) => [
                            ...(prevLeads || []),
                            ...listData.map((contact) => contact.leadsId),
                        ]);
                    }
                }else {
                    setTableData(listData);
                    setAllLeads(listData?.map((contact) => contact.leadsId));
                }
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

export default useFetchTableData;
