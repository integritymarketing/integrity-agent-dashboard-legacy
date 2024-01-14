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

function useFilteredLeadIds() {
    const filteredInfo = getItemFromLocalStorage("filterInfo");
    const filteredIds = getItemFromLocalStorage("filterLeadIds");

    const removeFilteredLeadIds = useCallback(() => {
        window.localStorage.removeItem("filterLeadIds");
        window.localStorage.removeItem("filterInfo");
    }, []);

    return { filteredIds, filteredInfo, removeFilteredLeadIds };
}

export default useFilteredLeadIds;
