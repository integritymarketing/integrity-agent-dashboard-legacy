import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import HealthConditionSearchSection from '../HealthConditionSearch';
import { useConditions } from 'providers/Life/Conditions/ConditionsContext';
import useUserProfile from 'hooks/useUserProfile';
import HealthConditionQuestionModal from '../HealthConditionQuestionModal';
import { useConditions as useConditionsHook } from 'providers/Conditions';
import useToast from 'hooks/useToast';

function HealthConditionSearchInput({ contactId }) {
  const [searchValue, setSearchValue] = useState('');
  const [conditions, setConditions] = useState([]);

  const agentUserProfile = useUserProfile();
  const showToast = useToast();

  const {
    fetchConditionsList,
    isLoadingConditions,
    saveHealthConditionDetails,
    isSavingHealthCondition,
  } = useConditions();

  const {
    fetchHealthConditions,
    healthConditions,
    setSelectedCondition,
    selectedCondition,
  } = useConditionsHook();

  const fetchConditions = useCallback(
    debounce(async query => {
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

  const handleInputChange = value => {
    setSearchValue(value);
    fetchConditions(value);
  };

  const saveSelectedCondition = async condition => {
    const payload = {
      stateCode: condition?.stateCode,
      conditionId: condition?.conditionId?.toString(),
      conditionName: condition?.conditionName,
      conditionDescription: condition?.conditionDescription,
      agentNPN: agentUserProfile?.npn,
      leadId: contactId,
      lastTreatmentDate: null,
      hasLookBackPeriod: condition.hasLookBackPeriod,
      consumerId: 0,
    };
    try {
      const response = await saveHealthConditionDetails(payload);
      if (response) {
        setConditions([]);
        setSearchValue('');
        await fetchHealthConditions(contactId);
      }
    } catch (error) {
      console.error('Failed to save health condition details', error);
    }
  };

  const handleOptionSelection = async condition => {
    if (healthConditions) {
      const healthCondition = healthConditions.find(
        healthCondition =>
          parseInt(healthCondition.conditionId, 10) === condition.conditionId
      );

      if (healthCondition) {
        showToast({
          type: 'error',
          message: 'Condition is already added...',
        });
        return;
      }
    }

    await saveSelectedCondition(condition);
    setSelectedCondition([condition]);
    await fetchHealthConditions(contactId);
  };

  const onSuccessOfHealthConditionQuestionModal = async () => {
    setSelectedCondition(null);
  };

  return (
    <>
      <HealthConditionSearchSection
        title='Or search for a health condition'
        placeholder='Search'
        value={searchValue}
        onChange={handleInputChange}
        conditions={conditions}
        handleSelect={handleOptionSelection}
        loading={isLoadingConditions || isSavingHealthCondition}
      />
      {selectedCondition && (
        <HealthConditionQuestionModal
          open={selectedCondition}
          onClose={() => {
            setSelectedCondition(null);
          }}
          contactId={contactId}
          onSuccessOfHealthConditionQuestionModal={
            onSuccessOfHealthConditionQuestionModal
          }
          selectedCondition={selectedCondition}
        />
      )}
    </>
  );
}

export default HealthConditionSearchInput;
