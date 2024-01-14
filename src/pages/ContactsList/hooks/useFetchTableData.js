import * as Sentry from "@sentry/react";
import { useCallback, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import useToast from "hooks/useToast";

import clientsService from "services/clientsService";

const getAndResetItemFromLocalStorage = (key, initialValue) => {
    try {
        const item = window.localStorage.getItem(key);
        const val = item ? JSON.parse(item) : initialValue;
        return val;
    } catch (error) {
        Sentry.captureException(error);
        window.localStorage.removeItem(key);
        return initialValue;
    }
};

function useFetchTableData() {
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [allLeads, setAllLeads] = useState([]);
    const [pageResult, setPageResult] = useState(null);
    const showToast = useToast();
    const location = useLocation();

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

    const fetchTableData = useCallback(
        async ({ pageIndex, pageSize, sort, searchString, returnAll, isSilent }) => {
            try {
                if (!isSilent) {
                    setIsLoading(true);
                }
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
                const listData = response?.result.map((res) => ({
                    ...res,
                    contactRecordType:
                        (res.contactRecordType === "Client" || res.contactRecordType === "client") && !res.statusName
                            ? "Enrolled"
                            : res.contactRecordType,
                }));
                setPageResult(response?.pageResult);
                setTableData(listData);
                setAllLeads(listData?.map((contact) => contact.leadsId));
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

    return { tableData, isLoading: isLoading, fetchTableData, allLeads, pageResult };
}

export default useFetchTableData;
