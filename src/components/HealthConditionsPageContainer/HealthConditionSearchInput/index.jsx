import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import HealthConditionSearchSection from '../HealthConditionSearch';
import { useConditions } from 'providers/Life/Conditions/ConditionsContext';
import useUserProfile from 'hooks/useUserProfile';
import useAnalytics from 'hooks/useAnalytics';
import { useConditions as useConditionsHook } from 'providers/Conditions';
import { SEARCH_BY_CONDITION } from '../HealthConditionContainer.constants';

function HealthConditionSearchInput({
  contactId,
  consumerId,
  isSimplifiedIUL = false,
}) {
  const [searchValue, setSearchValue] = useState('');
  const [conditions, setConditions] = useState([]);

  const agentUserProfile = useUserProfile();
  const { fireEvent } = useAnalytics();

  const {
    fetchConditionsList,
    isLoadingConditions,
    saveHealthConditionDetails,
    isSavingHealthCondition,
  } = useConditions();

  const {
    fetchHealthConditions,
    healthConditions,
    handleApplyClickOfAddPrescriptionModal,
    setIsConditionAddedAlready,
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
    setIsConditionAddedAlready(false);
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
      consumerId: consumerId,
    };

    try {
      const response = await saveHealthConditionDetails(payload);
      if (response) {
        setConditions([]);
        setSearchValue('');

        const flow = isSimplifiedIUL ? 'simplified_iul' : 'final_expense';

        fireEvent('Health Condition Added', {
          leadid: contactId,
          flow: flow,
          fex_questions_required: 'Yes',
          fex_questions_complete: 'Yes',
        });
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
        setIsConditionAddedAlready(true);
        return;
      } else {
        setIsConditionAddedAlready(false);
      }
    }

    await saveSelectedCondition(condition);
    handleApplyClickOfAddPrescriptionModal([condition], SEARCH_BY_CONDITION);

    await fetchHealthConditions(contactId);
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
    </>
  );
}

export default HealthConditionSearchInput;
