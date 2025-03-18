import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import HealthConditionSearchSection from '../HealthConditionSearch';
import { useConditions } from 'providers/Conditions';
import { debounce } from 'lodash';

function HealthConditionSearchByPrescription({
  selectedPrescription,
  setOpenAddPrescriptionModal,
  setPrescriptionDetails,
  setSelectedPrescription,
}) {
  const [inputValue, setInputValue] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [healthConditionsData, setHealthConditionsData] = useState([]);
  const { fetchSearchHealthConditions, searchHealthConditionsLoading } =
    useConditions();

  useEffect(() => {
    setInputValue(
      selectedPrescription ? selectedPrescription.dosage.drugName : ''
    );
  }, [selectedPrescription]);

  const debouncedSearch = useCallback(
    debounce(async query => {
      let data = await fetchSearchHealthConditions(query);

      if (!data || !Array.isArray(data)) {
        setHealthConditionsData([]);
        return;
      }

      setHealthConditionsData(
        data.sort((a, b) => {
          const aName = a?.name?.toLowerCase() || '';
          const bName = b?.name?.toLowerCase() || '';
          const queryLower = query?.toLowerCase() || '';

          const aStartsWithQuery = aName.startsWith(queryLower);
          const bStartsWithQuery = bName.startsWith(queryLower);

          if (aStartsWithQuery && !bStartsWithQuery) return -1;
          if (!aStartsWithQuery && bStartsWithQuery) return 1;

          // Sort alphabetically
          if (aName < bName) return -1;
          if (aName > bName) return 1;

          // Sort by spaces
          const aHasSpace = aName.includes(' ');
          const bHasSpace = bName.includes(' ');
          if (aHasSpace && !bHasSpace) return 1;
          if (!aHasSpace && bHasSpace) return -1;

          // Sort by special characters
          const aHasSpecialChar = /[^a-zA-Z0-9 ]/.test(aName);
          const bHasSpecialChar = /[^a-zA-Z0-9 ]/.test(bName);
          if (aHasSpecialChar && !bHasSpecialChar) return 1;
          if (!aHasSpecialChar && bHasSpecialChar) return -1;

          return 0;
        })
      );
    }, 500),
    [fetchSearchHealthConditions]
  );

  useEffect(() => {
    if (inputValue.length >= 3) {
      handleSearch();
    }
    if (inputValue.length === 0) {
      setHealthConditionsData([]);
    }
  }, [inputValue]);

  const handleSearch = async () => {
    setLoaded(false);
    if (!selectedPrescription) {
      debouncedSearch(inputValue);
    }
  };

  useEffect(() => {
    if (
      healthConditionsData &&
      healthConditionsData.length &&
      selectedPrescription
    ) {
      const healthCondition = healthConditionsData.find(
        condition =>
          condition.name.toLowerCase() ===
          selectedPrescription.dosage.drugName.toLowerCase()
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

  const handleChange = value => {
    if (value) {
      setInputValue('');
      setHealthConditionsData([]);
      setPrescriptionDetails(value);
      setOpenAddPrescriptionModal(true);
    }
    setSelectedPrescription(value?.length ? value?.name : null);
  };

  return (
    <>
      <HealthConditionSearchSection
        title='Add your health condition by searching your prescription:'
        placeholder='Search'
        value={inputValue}
        handleSelect={value => handleChange(value)}
        conditions={healthConditionsData || []}
        loading={searchHealthConditionsLoading}
        onChange={value => setInputValue(value)}
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
