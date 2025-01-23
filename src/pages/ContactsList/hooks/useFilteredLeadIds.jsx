import { useCallback, useEffect } from "react";
import * as Sentry from "@sentry/react";
import { getAndResetItemFromLocalStorage } from "utils/shared-utils/sharedUtility";

const removeItemFromLocalStorage = (key) => {
    try {
        window.localStorage.removeItem(key);
    } catch (error) {
        Sentry.captureException(error);
    }
};

const setItemInLocalStorage = (key, value) => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        Sentry.captureException(error);
    }
};

const removeMultipleItemsFromLocalStorage = (keys) => {
    keys.forEach((key) => removeItemFromLocalStorage(key));
};

function useFilteredLeadIds() {
    const removeFilteredLeadIds = useCallback(() => {
        removeItemFromLocalStorage("filterLeadIds");
        removeItemFromLocalStorage("filterInfo");
        removeItemFromLocalStorage("duplicateLeadIds");
        removeItemFromLocalStorage("campaignsLeadIds");
        removeItemFromLocalStorage("campaignsLeadInfo");
    }, []);

    const filteredInfo = getAndResetItemFromLocalStorage("filterInfo");
    const filteredIds = getAndResetItemFromLocalStorage("filterLeadIds");
    const duplicateIds = getAndResetItemFromLocalStorage("duplicateLeadIds");
    const campaignsLeadIds = getAndResetItemFromLocalStorage("campaignsLeadIds");
    const campaignsLeadInfo = getAndResetItemFromLocalStorage("campaignsLeadInfo");

    const setFilteredDataHandle = (key1, key2, leadIds, leadInfo) => {
        handleStorageChange(key1);
        setItemInLocalStorage(key1, leadIds);
        if (key2 && leadInfo) setItemInLocalStorage(key2, leadInfo);
    };

    const handleStorageChange = useCallback((key) => {
        if (key === "campaignsLeadIds") {
            removeMultipleItemsFromLocalStorage([
                "duplicateLeadIds",
                "filterLeadIds",
                "filterInfo",
                "contactList_filterSectionsConfig",
                "contactList_selectedFilterSections",
            ]);
        } else if (key === "duplicateLeadIds") {
            removeMultipleItemsFromLocalStorage([
                "campaignsLeadIds",
                "campaignsLeadInfo",
                "filterLeadIds",
                "filterInfo",
                "contactList_filterSectionsConfig",
                "contactList_selectedFilterSections",
            ]);
        } else if (key === "filterLeadIds") {
            removeMultipleItemsFromLocalStorage(["campaignsLeadIds", "campaignsLeadInfo", "duplicateLeadIds"]);
        }
    }, []);

    useEffect(() => {
        const handleStorageEvent = (event) => {
            if (event.key) {
                handleStorageChange(event.key);
            }
        };

        window.addEventListener("storage", handleStorageEvent);

        return () => {
            window.removeEventListener("storage", handleStorageEvent);
        };
    }, [handleStorageChange]);

    return {
        removeFilteredLeadIds,
        filteredIds,
        filteredInfo,
        duplicateIds,
        campaignsLeadIds,
        campaignsLeadInfo,
        setFilteredDataHandle,
    };
}

export default useFilteredLeadIds;
