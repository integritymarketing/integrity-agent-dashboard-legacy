import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import HealthConditionSearchSection from "../HealthConditionSearch";
import { useConditions } from "providers/Conditions";
import { debounce } from "lodash";

function HealthConditionSearchByPrescription({
    selectedPrescription,
    setOpenAddPrescriptionModal,
    setPrescriptionDetails,
}) {
    const [healthCondition, setHealthCondition] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [loaded, setLoaded] = useState(false);
    const { fetchSearchHealthConditions, searchHealthConditionsLoading, searchHealthConditionsData } = useConditions();

    useEffect(() => {
        if (selectedPrescription) {
            setHealthCondition(selectedPrescription.dosage.drugName);
            setInputValue(selectedPrescription.dosage.drugName);
        }
    }, [selectedPrescription]);

    const debouncedSearch = useCallback(
        debounce(async (query) => {
            await fetchSearchHealthConditions(query);
        }, 500),
        [fetchSearchHealthConditions],
    );

    useEffect(() => {
        if (inputValue.length >= 3) {
            handleSearch();
        }
    }, [inputValue]);

    const handleSearch = async () => {
        setLoaded(false);
        debouncedSearch(inputValue);
    };

    useEffect(() => {
        if (searchHealthConditionsData && searchHealthConditionsData.length && selectedPrescription) {
            const healthCondition = searchHealthConditionsData.find(
                (condition) => condition.name.toLowerCase() === selectedPrescription.dosage.drugName.toLowerCase(),
            );
            handleChange(healthCondition);
        }

        if (searchHealthConditionsData && searchHealthConditionsData.length === 0) {
            setLoaded(true);
        }
    }, [searchHealthConditionsData, selectedPrescription]);

    const handleChange = (value) => {
        if (value) {
            setPrescriptionDetails(value);
            setOpenAddPrescriptionModal(true);
        }
    };

    return (
        <>
            <HealthConditionSearchSection
                title="Add your health condition by searching your prescription:"
                placeholder="Search"
                value={inputValue}
                handleSelect={(value) => handleChange(value)}
                conditions={searchHealthConditionsData || []}
                loading={searchHealthConditionsLoading}
                onChange={(value) => setInputValue(value)}
                loaded={loaded}
            />
        </>
    );
}

HealthConditionSearchByPrescription.propTypes = {
    selectedPrescription: PropTypes.object,
    setOpenAddPrescriptionModal: PropTypes.func,
    setPrescriptionDetails: PropTypes.func,
};

export default HealthConditionSearchByPrescription;
