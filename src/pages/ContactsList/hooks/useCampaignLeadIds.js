import * as Sentry from "@sentry/react";
import { useCallback } from "react";

const getItemFromLocalStorage = (key) => {
    try {
        const item = window.localStorage.getItem(key);
        const val = item ? JSON.parse(item) : null;
        return val;
    } catch (error) {
        Sentry.captureException(error);
        window.localStorage.removeItem(key);
        return null;
    }
};

function useCampaignLeadIds() {
    const filteredInfo = getItemFromLocalStorage("campaignsLeadInfo");
    const filteredIds = getItemFromLocalStorage("campaignsLeadIds");

    const removeFilteredLeadIds = useCallback(() => {
        window.localStorage.removeItem("campaignsLeadIds");
        window.localStorage.removeItem("campaignsLeadInfo");
    }, []);

    return { filteredIds, filteredInfo, removeFilteredLeadIds };
}

export default useCampaignLeadIds;
