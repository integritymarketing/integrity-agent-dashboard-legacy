import { createContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useClientServiceContext } from "services/clientServiceProvider";

export const StageStatusContext = createContext({
    allStatuses: [],
    statusOptions: [],
    lostSubStatusesOptions: [],
});

export const StageStatusProvider = ({ children }) => {
    const [allStatuses, setAllStatuses] = useState([]);
    const { clientsService } = useClientServiceContext();

    const statusOptions = useMemo(
        () =>
            allStatuses.map(({ statusName, hexValue, leadStatusId }) => ({
                value: statusName,
                label: statusName,
                color: hexValue,
                statusId: leadStatusId,
            })),
        [allStatuses]
    );

    const lostSubStatusesOptions = useMemo(() => {
        const lostStatus = allStatuses.find(({ statusName }) => statusName === "Lost");
        return (
            lostStatus?.leadSubStatus?.map(({ leadStatusId, statusName }) => ({
                value: leadStatusId,
                label: statusName,
            })) || []
        );
    }, [allStatuses]);

    const fetchStatuses = async () => {
        const fetchedStatuses = await clientsService.getStatuses();
        setAllStatuses(fetchedStatuses);
    };

    useEffect(() => {
        fetchStatuses();
    }, []);

    return (
        <StageStatusContext.Provider value={{ allStatuses, statusOptions, lostSubStatusesOptions }}>
            {children}
        </StageStatusContext.Provider>
    );
};

StageStatusProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default StageStatusContext;
