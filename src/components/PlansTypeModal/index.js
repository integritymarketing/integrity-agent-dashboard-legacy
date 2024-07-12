import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { Divider } from "@mui/material";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

import useAgentInformationByID from "hooks/useAgentInformationByID";
import useAnalytics from "hooks/useAnalytics";
import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";
import useUserProfile from "hooks/useUserProfile";

import { useAgentAccountContext } from "providers/AgentAccountProvider";

import { SellingPermissionsModal } from "components/FinalExpensePlansContainer/FinalExpenseContactDetailsForm/SellingPermissionsModal";
import { AGENT_SERVICE_NON_RTS } from "components/FinalExpensePlansContainer/FinalExpensePlansContainer.constants";
import Modal from "components/Modal";
import HealthIcon from "components/icons/healthIcon";
import LifeIcon from "components/icons/lifeIcon";
import Checkbox from "components/ui/Checkbox";

import styles from "./styles.module.scss";

const LIFE = "hideLifeQuote";
const HEALTH = "hideHealthQuote";

const PlansTypeModal = ({ showPlanTypeModal, handleModalClose, leadId, zipcode }) => {
    const [checked, setChecked] = useState(false);
    const [showSellingPermissionModal, setShowSellingPermissionModal] = useState(false);

    const navigate = useNavigate();
    const showToast = useToast();
    const { agentId } = useUserProfile();
    const { agentInformation } = useAgentInformationByID();
    const agentNPN = agentInformation?.agentNPN;
    const { fireEvent } = useAnalytics();
    const { leadPreference, updateAgentPreferences } = useAgentAccountContext();

    const shouldShowPlanTypeModal = !leadPreference?.hideHealthQuote && !leadPreference?.hideLifeQuote;

    const { Get: getAgentNonRTS } = useFetch(`${AGENT_SERVICE_NON_RTS}${agentNPN}`);

    const onSelectHandle = useCallback(
        async (type) => {
            try {
                if (checked) {
                    const updatedType = type === LIFE ? HEALTH : LIFE;
                    const payload = {
                        agentID: agentId,
                        leadPreference: {
                            ...leadPreference,
                            [updatedType]: true,
                        },
                    };
                    await updateAgentPreferences(payload);
                }
            } catch (error) {
                showToast({
                    type: "error",
                    message: "Failed to save the preferences.",
                    time: 10000,
                });
            }
        },
        [agentId, checked, leadPreference, showToast, updateAgentPreferences]
    );

    const handleHealthPlanClick = useCallback(() => {
        onSelectHandle(HEALTH);
        if (zipcode) {
            fireEvent("Quote Type Selected", {
                leadid: leadId,
                line_of_business: "Health",
            });
            navigate(`/plans/${leadId}`);
        } else {
            navigate(`/contact/${leadId}/addZip`);
        }
    }, [fireEvent, leadId, navigate, onSelectHandle, zipcode]);

    const handleFinalExpensePlanClick = useCallback(async () => {
        const isAgentNonRTS = await getAgentNonRTS();
        if (isAgentNonRTS === "True") {
            setShowSellingPermissionModal(true);
        } else {
            onSelectHandle(LIFE);
            fireEvent("Quote Type Selected", {
                leadid: leadId,
                line_of_business: "Life",
            });
            navigate(`/finalexpenses/create/${leadId}`);
        }
    }, [fireEvent, getAgentNonRTS, leadId, navigate, onSelectHandle]);

    const handleContinue = () => {
        fireEvent("Quote Type Selected", {
            leadid: leadId,
            line_of_business: "Life",
        });
        navigate(`/finalexpenses/create/${leadId}`);
    };

    /**
     * If the modal is shown and both health and life quotes are not hidden,
     * it determines the current type from the user's preferences.
     * If the current type is health, it triggers the health plan click.
     * If the current type is life, it triggers the final expense plan click.
     */
    useEffect(() => {
        if (!shouldShowPlanTypeModal && showPlanTypeModal) {
            const currentType = leadPreference?.hideLifeQuote ? HEALTH : LIFE;
            if (currentType === HEALTH) {
                handleHealthPlanClick();
            } else {
                handleFinalExpensePlanClick();
            }
        }
    }, [
        shouldShowPlanTypeModal,
        leadPreference,
        showPlanTypeModal,
        handleHealthPlanClick,
        handleFinalExpensePlanClick,
    ]);

    if (!shouldShowPlanTypeModal) {
        return (
            <SellingPermissionsModal
                showSellingPermissionModal={showSellingPermissionModal}
                handleModalClose={() => {
                    setShowSellingPermissionModal(false);
                    handleModalClose();
                }}
                handleContinue={handleContinue}
            />
        );
    }

    return (
        <>
            <Modal open={showPlanTypeModal} onClose={handleModalClose} hideFooter title="Choose Quote Type">
                <Box className={styles.container}>
                    <Box className={styles.plan} onClick={handleFinalExpensePlanClick}>
                        <Box className={styles.icon}>
                            <LifeIcon />
                        </Box>
                        <Box className={styles.title}>LifeCENTER</Box>
                    </Box>
                    <Box className={styles.plan} onClick={handleHealthPlanClick}>
                        <Box className={styles.icon}>
                            <HealthIcon />
                        </Box>
                        <Box className={styles.title}>HealthCENTER</Box>
                    </Box>
                </Box>
                <Divider />
                <Box display="flex" gap="0px" alignItems="center" justifyContent="center" marginTop="30px">
                    <Checkbox label="Don't show this again" checked={checked} onChange={() => setChecked(!checked)} />
                </Box>
            </Modal>
            <SellingPermissionsModal
                showSellingPermissionModal={showSellingPermissionModal}
                handleModalClose={() => {
                    setShowSellingPermissionModal(false);
                    handleModalClose();
                }}
                handleContinue={handleContinue}
            />
        </>
    );
};

PlansTypeModal.propTypes = {
    showPlanTypeModal: PropTypes.bool.isRequired, // Determines if the modal is open
    handleModalClose: PropTypes.func.isRequired, // Function to call when closing the modal
    leadId: PropTypes.number.isRequired, // Lead ID for navigation
    zipcode: PropTypes.string.isRequired, // zip code value
};

export default PlansTypeModal;
