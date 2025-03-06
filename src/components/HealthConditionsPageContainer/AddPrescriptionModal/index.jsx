import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { MultiSelectDropdown } from '@integritymarketing/clients-ui-kit';
import { useConditions } from 'providers/Conditions';
import { Dialog, DialogContent } from '@mui/material';
import useAgentInformationByID from 'hooks/useAgentInformationByID';

function AddPrescriptionModal({
  open,
  onClose,
  prescriptionDetails,
  contactId,
  onHandleApplyClickOfAddPrescriptionModal,
}) {
  const {
    prescriptionConditions,
    handleHealthConditionClose,
    fetchPrescriptionConditions,
    addHealthConditions,
    healthConditionsQuestions,
    getPrescriptionConditionsLoading,
    postHealthConditionsLoading,
    selectedPrescription,
    setSelectedPrescription,
  } = useConditions();

  const { agentInformation } = useAgentInformationByID();
  const [selectedCondition, setSelectedCondition] = useState(null);
  const hasFetchedConditions = useRef(false);

  useEffect(() => {
    if (prescriptionDetails && !hasFetchedConditions.current) {
      hasFetchedConditions.current = true;
      fetchPrescriptionConditions(prescriptionDetails.name);
    }
    if (
      selectedPrescription &&
      'dosage' in selectedPrescription &&
      !hasFetchedConditions.current
    ) {
      hasFetchedConditions.current = true;
      fetchPrescriptionConditions(selectedPrescription.dosage.ndc);
    }
  }, [prescriptionDetails?.name, selectedPrescription]);

  const onApplyClick = async value => {
    setSelectedCondition(value);
    let payloadData = value.map(condition => ({
      ...condition,
      conditionId: condition.conditionId.toString(),
      stateCode: condition.stateCode,
      leadId: contactId,
      lastTreatmentDate: null,
      consumerId: 0,
      agentNPN: agentInformation?.agentNPN,
    }));
    setSelectedPrescription(null);
    await addHealthConditions(payloadData, contactId);
  };

  useEffect(() => {
    if (healthConditionsQuestions.length > 0) {
      handleHealthConditionClose();
      onHandleApplyClickOfAddPrescriptionModal(selectedCondition);
    }
  }, [healthConditionsQuestions]);

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          onClose();
          handleHealthConditionClose();
        }}
        maxWidth='md'
      >
        <DialogContent sx={{ padding: 0 }}>
          <MultiSelectDropdown
            header='Search for a Condition b Prescription'
            title={
              prescriptionDetails?.name ||
              selectedPrescription?.dosage?.labelName
            }
            subtitle='Select the associated condition(s) for this medication'
            submitLabel='Next'
            handleApplyClick={onApplyClick}
            handleCancelClick={() => {
              onClose();
              handleHealthConditionClose();
              setSelectedPrescription(null);
            }}
            conditions={prescriptionConditions}
            loading={
              getPrescriptionConditionsLoading || postHealthConditionsLoading
            }
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

AddPrescriptionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  prescriptionDetails: PropTypes.object.isRequired,
  contactId: PropTypes.string.isRequired,
  onHandleApplyClickOfAddPrescriptionModal: PropTypes.func.isRequired,
};

AddPrescriptionModal.defaultProps = {
  open: false,
  onClose: () => {},
  prescriptionDetails: null,
};

export default AddPrescriptionModal;
