import React, { useState, useCallback } from "react";
import { debounce } from "lodash";
import HealthConditionSearchSection from "../HealthConditionSearch";
import { useConditions } from "providers/Life/Conditions/ConditionsContext";
import useUserProfile from "hooks/useUserProfile";
import HealthConditionQuestionModal from "../HealthConditionQuestionModal";
import { useConditions as useConditionsHook } from "providers/Conditions";

function HealthConditionSearchInput({ contactId }) {
    const [searchValue, setSearchValue] = useState("");
    const [conditions, setConditions] = useState([]);
    const [selectedCondition, setSelectedCondition] = useState(null);

    const agentUserProfile = useUserProfile();

    const { fetchConditionsList, isLoadingConditions, saveHealthConditionDetails, isSavingHealthCondition } =
        useConditions();

    const { fetchHealthConditionsQuestionsByCondtionId, getHealthConditionsQuestionsData, fetchHealthConditions } =
        useConditionsHook();

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

    const handleOptionSelection = async (condition) => {
        await saveSelectedCondition(condition);
        setSelectedCondition(condition);
        await fetchHealthConditionsQuestionsByCondtionId(contactId, condition?.conditionId);
    };

    const onSuccessOfHealthConditionQuestionModal = async () => {
        setSelectedCondition(null);
        await fetchHealthConditions(contactId);
    };

    return (
        <>
            <HealthConditionSearchSection
                title="Or search for a health condition"
                placeholder="Search"
                value={searchValue}
                onChange={handleInputChange}
                conditions={conditions}
                handleSelect={handleOptionSelection}
                loading={isLoadingConditions || isSavingHealthCondition}
            />
            {selectedCondition && getHealthConditionsQuestionsData && (
                <HealthConditionQuestionModal
                    open={selectedCondition && getHealthConditionsQuestionsData}
                    onClose={() => {
                        setSelectedCondition(null);
                    }}
                    contactId={contactId}
                    onSuccessOfHealthConditionQuestionModal={onSuccessOfHealthConditionQuestionModal}
                    selectedCondition={[selectedCondition]}
                />
            )}
        </>
    );
}

export default HealthConditionSearchInput;
