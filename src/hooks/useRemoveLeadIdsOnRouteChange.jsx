import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useRemoveLeadIdsOnRouteChange = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes("/contacts")) {
            return;
        }
        window.localStorage.removeItem("duplicateLeadIds");
        window.localStorage.removeItem("filterLeadIds");
    }, [location.pathname]);
};

export default useRemoveLeadIdsOnRouteChange;
