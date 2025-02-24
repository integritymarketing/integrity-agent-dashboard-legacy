import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { MultiSelectDropdown } from "@integritymarketing/clients-ui-kit";
import { useConditions } from "providers/Conditions";
import { Dialog, DialogContent } from "@mui/material";
import useAgentInformationByID from "hooks/useAgentInformationByID";

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
    } = useConditions();

    const { agentInformation } = useAgentInformationByID();
    const [selectedCondition, setSelectedCondition] = useState(null);

    useEffect(() => {
        if (prescriptionDetails) {
            fetchPrescriptionConditions(prescriptionDetails.name);
        }
    }, [prescriptionDetails.name]);

    useEffect(() => {
        console.log("getHealthConditionsQuestionsLoading", getPrescriptionConditionsLoading);
    }, [getPrescriptionConditionsLoading]);

    const onApplyClick = async (value) => {
        setSelectedCondition(value);
        let payloadData = value.map((condition) => ({
            ...condition,
            conditionId: condition.conditionId.toString(),
            stateCode: condition.stateCode,
            leadId: contactId,
            lastTreatmentDate: null,
            consumerId: 0,
            agentNPN: agentInformation?.agentNPN,
        }));

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
                maxWidth="md"
            >
                <DialogContent sx={{ padding: 0 }}>
                    <MultiSelectDropdown
                        header={"Search for a Condition by Prescription"}
                        title={prescriptionDetails?.name}
                        subtitle={"Select the associated condition(s) for this medication"}
                        submitLabel={"Next"}
                        handleApplyClick={onApplyClick}
                        handleCancelClick={() => {
                            onClose();
                            handleHealthConditionClose();
                        }}
                        conditions={prescriptionConditions}
                        loading={getPrescriptionConditionsLoading || postHealthConditionsLoading}
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
