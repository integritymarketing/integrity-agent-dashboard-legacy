import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

import useAgentInformationByID from "hooks/useAgentInformationByID";
import useAnalytics from "hooks/useAnalytics";
import useFetch from "hooks/useFetch";

import { SellingPermissionsModal } from "components/FinalExpensePlansContainer/FinalExpenseContactDetailsForm/SellingPermissionsModal";
import { AGENT_SERVICE_NON_RTS } from "components/FinalExpensePlansContainer/FinalExpensePlansContainer.constants";
import Modal from "components/Modal";
import HealthIcon from "components/icons/healthIcon";
import LifeIcon from "components/icons/lifeIcon";

import styles from "./styles.module.scss";

const PlansTypeModal = ({ showPlanTypeModal, handleModalClose, leadId, zipcode }) => {
    const navigate = useNavigate();

    const [showSellingPermissionModal, setShowSellingPermissionModal] = useState(false);

    const { agentInformation } = useAgentInformationByID();
    const { agentNPN } = agentInformation;
    const { fireEvent } = useAnalytics();

    const { Get: getAgentNonRTS } = useFetch(`${AGENT_SERVICE_NON_RTS}${agentNPN}`);

    const handleHealthPlanClick = () => {
        if (zipcode) {
            fireEvent("Quote Type Selected", {
                leadid: leadId,
                line_of_business: "Health",
            });
            navigate(`/plans/${leadId}`);
        } else {
            navigate(`/contact/${leadId}/addZip`);
        }
    };

    const handleFinalExpensePlanClick = async () => {
        const isAgentNonRTS = await getAgentNonRTS();
        if (isAgentNonRTS === "True") {
            setShowSellingPermissionModal(true);
        } else {
            fireEvent("Quote Type Selected", {
                leadid: leadId,
                line_of_business: "Life",
            });
            navigate(`/finalexpenses/create/${leadId}`);
        }
    };

    const handleContinue = () => {
        setShowSellingPermissionModal(false);
        fireEvent("Quote Type Selected", {
            leadid: leadId,
            line_of_business: "Life",
        });
        navigate(`/finalexpenses/create/${leadId}`);
    };

    return (
        <Modal open={showPlanTypeModal} onClose={handleModalClose} hideFooter title="Choose Plan Type">
            <>
                <div className={styles.container}>
                    <div className={styles.plan} onClick={handleHealthPlanClick}>
                        <div className={styles.icon}>
                            <HealthIcon />
                        </div>
                        <div className={styles.title}>Health</div>
                    </div>
                    <div className={styles.plan} onClick={handleFinalExpensePlanClick}>
                        <div className={styles.icon}>
                            <LifeIcon />
                        </div>
                        <div className={styles.title}>Life</div>
                    </div>
                </div>
                {showSellingPermissionModal && (
                    <SellingPermissionsModal
                        showSellingPermissionModal={showSellingPermissionModal}
                        handleModalClose={() => {
                            setShowSellingPermissionModal(false);
                        }}
                        handleContinue={handleContinue}
                    />
                )}
            </>
        </Modal>
    );
};

PlansTypeModal.propTypes = {
    showPlanTypeModal: PropTypes.bool.isRequired, // Determines if the modal is open
    handleModalClose: PropTypes.func.isRequired, // Function to call when closing the modal
    leadId: PropTypes.number.isRequired, // Lead ID for navigation
    zipcode: PropTypes.string.isRequired, // zip code value
};

export default PlansTypeModal;
