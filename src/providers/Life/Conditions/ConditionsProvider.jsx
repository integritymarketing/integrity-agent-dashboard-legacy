import { QUOTES_API_VERSION } from "services/clientsService";
import { createContext, useMemo, useCallback } from "react";
import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";
import PropTypes from "prop-types";
import _ from "lodash";

export const ConditionsContext = createContext();

export const ConditionsProvider = ({ children }) => {
    const showToast = useToast();
    const HEALTH_CONDITION_SEARCH_API = `${
        import.meta.env.VITE_QUOTE_URL
    }/api/${QUOTES_API_VERSION}/Underwriting/healthcondition/search/HEALTH`;

    const HEALTH_CONDITION_SAVE_API = `${
        import.meta.env.VITE_QUOTE_URL
    }/api/${QUOTES_API_VERSION}/HealthCondition/Lead`;

    const {
        Get: getConditions,
        loading: isLoadingConditions,
        error: getConditionsError,
    } = useFetch(HEALTH_CONDITION_SEARCH_API);

    const {
        Post: saveHealthCondition,
        loading: isSavingHealthCondition,
        error: saveHealthConditionError,
    } = useFetch(HEALTH_CONDITION_SAVE_API);

    const fetchConditionsList = useCallback(
        async (searchvalue) => {
            try {
                const response = await getConditions(null, false, searchvalue);
                if (response) {
                    return response;
                }
            } catch (error) {
                showToast({
                    type: "error",
                    message: `Failed to get quote details`,
                });
                return null;
            }
        },
        [getConditions, showToast]
    );

    const saveHealthConditionDetails = useCallback(
        async (condition) => {
            try {
                const response = await saveHealthCondition(condition, true, condition?.leadId);
                if (response.status === 200) {
                    showToast({
                        type: "success",
                        message: `Health condition details saved successfully`,
                    });
                    return response;
                }
            } catch (error) {
                showToast({
                    type: "error",
                    message: `Failed to save health condition details`,
                });
                return null;
            }
        },
        [saveHealthCondition, showToast]
    );

    const contextValue = useMemo(
        () => ({
            fetchConditionsList,
            isLoadingConditions,
            getConditionsError,
            saveHealthConditionDetails,
            isSavingHealthCondition,
            saveHealthConditionError,
        }),
        [
            fetchConditionsList,
            isLoadingConditions,
            getConditionsError,
            saveHealthConditionDetails,
            isSavingHealthCondition,
            saveHealthConditionError,
        ]
    );

    return <ConditionsContext.Provider value={contextValue}>{children}</ConditionsContext.Provider>;
};

ConditionsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
