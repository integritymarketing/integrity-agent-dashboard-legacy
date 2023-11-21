import * as Sentry from "@sentry/react";
import { useCallback } from "react";

const getItemFromLocalStorage = (key, initialValue) => {
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

function useDuplicateLeadIds() {
    const removeDuplicateIds = useCallback(() => {
        window.localStorage.removeItem("duplicateLeadIds");
    }, []);

    return { duplicateIds: getItemFromLocalStorage("duplicateLeadIds"), removeDuplicateIds };
}

export default useDuplicateLeadIds;
