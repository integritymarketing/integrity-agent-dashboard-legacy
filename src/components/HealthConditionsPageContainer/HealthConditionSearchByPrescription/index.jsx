import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import HealthConditionSearchSection from "../HealthConditionSearch";
import { useConditions } from "providers/Conditions";
import { debounce } from "lodash";

function HealthConditionSearchByPrescription({
    selectedPrescription,
    setOpenAddPrescriptionModal,
    setPrescriptionDetails,
    setSelectedPrescription,
}) {
    const [inputValue, setInputValue] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [healthConditionsData, setHealthConditionsData] = useState([]);
    const { fetchSearchHealthConditions, searchHealthConditionsLoading } = useConditions();

    useEffect(() => {
        if (selectedPrescription) {
            setInputValue(selectedPrescription.dosage.drugName);
        }
    }, [selectedPrescription]);

    const debouncedSearch = useCallback(
        debounce(async (query) => {
            let data = await fetchSearchHealthConditions(query);
            setHealthConditionsData(data);
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
        if (healthConditionsData && healthConditionsData.length && selectedPrescription) {
            const healthCondition = healthConditionsData.find(
                (condition) => condition.name.toLowerCase() === selectedPrescription.dosage.drugName.toLowerCase(),
            );
            handleChange(healthCondition);
        }

        if (
            healthConditionsData &&
            healthConditionsData.length === 0 &&
            (selectedPrescription || inputValue.length > 2)
        ) {
            setLoaded(true);
        }
    }, [healthConditionsData, selectedPrescription]);

    const handleChange = (value) => {
        if (value) {
            setInputValue("");
            setHealthConditionsData([]);
            setPrescriptionDetails(value);
            setOpenAddPrescriptionModal(true);
        }
        setSelectedPrescription(value?.length ? value?.name : null);
    };

    return (
        <>
            <HealthConditionSearchSection
                title="Add your health condition by searching your prescription:"
                placeholder="Search"
                value={inputValue}
                handleSelect={(value) => handleChange(value)}
                conditions={healthConditionsData || []}
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
