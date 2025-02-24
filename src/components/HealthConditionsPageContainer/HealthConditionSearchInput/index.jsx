import React, { useState, useCallback } from "react";
import { debounce } from "lodash";
import HealthConditionSearchSection from "../HealthConditionSearch";
import { useConditions } from "providers/Life/Conditions/ConditionsContext";
import useUserProfile from "hooks/useUserProfile";

function HealthConditionSearchInput({ contactId }) {
    const [searchValue, setSearchValue] = useState("");
    const [conditions, setConditions] = useState([]);

    const agentUserProfile = useUserProfile();

    const { fetchConditionsList, isLoadingConditions, saveHealthConditionDetails, isSavingHealthCondition } =
        useConditions();

    const fetchConditions = useCallback(
        debounce(async (query) => {
            if (query.length >= 3) {
                const response = await fetchConditionsList(query);
                if (response && response?.uwConditions) {
                    setConditions(response?.uwConditions || []);
                } else {
                    setConditions([]);
                }
            } else {
                setConditions([]);
            }
        }, 300),
        [fetchConditionsList]
    );

    const handleInputChange = (value) => {
        setSearchValue(value);
        fetchConditions(value);
    };

    const saveSelectedCondition = async (condition) => {
        const payload = {
            stateCode: condition?.stateCode,
            conditionId: condition?.conditionId?.toString(),
            conditionName: condition?.conditionName,
            conditionDescription: condition?.conditionDescription,
            agentNPN: agentUserProfile?.npn,
            leadId: contactId,
            lastTreatmentDate: null,
            hasLookBackPeriod: false,
            consumerId: 0,
        };

        try {
            const response = await saveHealthConditionDetails(payload);
            if (response) {
                setConditions([]);
                setSearchValue("");
            }
        } catch (error) {
            console.error("Failed to save health condition details", error);
        }
    };

    return (
        <HealthConditionSearchSection
            title="Or search for a health condition"
            placeholder="Search"
            value={searchValue}
            onChange={handleInputChange}
            conditions={conditions}
            handleSelect={saveSelectedCondition}
            loading={isLoadingConditions || isSavingHealthCondition}
        />
    );
}

export default HealthConditionSearchInput;
