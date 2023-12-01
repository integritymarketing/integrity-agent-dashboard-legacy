import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useRemoveDuplicateIdsOnRouteChange = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes("/contacts-list") || location.pathname.includes("/contacts")) {
            return;
        }
        window.localStorage.removeItem("duplicateLeadIds");
    }, [location.pathname]);
};

export default useRemoveDuplicateIdsOnRouteChange;
