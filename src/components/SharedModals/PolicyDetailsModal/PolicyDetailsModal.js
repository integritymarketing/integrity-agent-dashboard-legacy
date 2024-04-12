import { useEffect, useState, useMemo } from "react";
import useDeviceType from "hooks/useDeviceType";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Modal from "components/Modal";
import styles from "./PolicyDetailsModal.module.scss";
import { Button } from "components/ui/Button";
import ArrowRight from "components/icons/version-2/ArrowRight";
import { usePolicies } from "providers/ContactDetails";
import LifePolicy from "components/LifePolicy";
import { capitalizeFirstLetter } from "utils/shared-utils/sharedUtility";
import HealthPolicy from "components/HealthPolicy";
import { Life } from "components/icons/Life/life";
import { Health } from "components/icons/Health/health";
import { useNavigate } from "react-router-dom";
import OpenBlue from "components/icons/version-2/OpenBlue";

const PolicyDetailsModal = ({ showPolicyModal, handleModalClose, policyDetails }) => {
    const { firstName, lastName, leadsId, policy } = policyDetails;
    const { isMobile } = useDeviceType();
    const navigate = useNavigate();
    const isLife = policy === "LIFE";
    const { getEnrollPlansList, enrollPlansList } = usePolicies();
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        if (leadsId) {
            getEnrollPlansList(leadsId);
        }
    }, [leadsId, getEnrollPlansList]);

    useEffect(() => {
        if (enrollPlansList.length > 0) {
            const filteredPolicy = enrollPlansList.filter((plan) =>
                isLife ? plan.productCategory === "Final Expense" : plan.productCategory !== "Final Expense"
            );
            setPolicies(filteredPolicy);
        }
    }, [enrollPlansList, isLife]);

    const renderTitleComponent = () => (
        <Box className={styles.titleContainer}>
            {isLife ? <Life /> : <Health />}
            <Box className={styles.title}>{`${isLife ? "Life" : "Health"} Policies`}</Box>
        </Box>
    );

    const policyCards = useMemo(
        () =>
            policies.map((currentPolicy) => {
                const status =
                    currentPolicy.policyStatus === "terminated"
                        ? "Inactive"
                        : capitalizeFirstLetter(currentPolicy.policyStatus);

                const presentYear = new Date().getFullYear();

                const isDeclinedStatus = (status) => {
                    return status === "declined" || status === "inactive";
                };

                // For non-Final Expense plans, use the policyEffectiveDate to determine the year.
                const effectiveDate = currentPolicy.policyEffectiveDate
                    ? new Date(currentPolicy.policyEffectiveDate)
                    : null;
                const policyYear = effectiveDate ? effectiveDate.getFullYear() : null;

                const currentYear = policyYear === presentYear && !isDeclinedStatus(currentPolicy.policyStatus);

                const policyData = {
                    ...currentPolicy,
                    policyHolder: `${currentPolicy.consumerFirstName} ${currentPolicy.consumerLastName}`,
                    policyId: currentPolicy.policyNumber,
                    currentYear,
                    leadId: leadsId,
                    status,
                };

                return (
                    <div key={currentPolicy.policyNumber} className={styles.policyCard}>
                        <div className={styles.statusIcon}>
                            {isLife ? <LifePolicy status={status} /> : <HealthPolicy status={status} />}
                        </div>
                        <div className={styles.planContainer}>
                            <div className={styles.planName}>{currentPolicy.planName}</div>
                            <div>
                                <span className={styles.statusLabel}>Status:</span>
                                <span className={styles.statusValue}>{status}</span>
                            </div>
                        </div>
                        {currentPolicy.hasPlanDetails && (
                            <Button
                                icon={<OpenBlue />}
                                iconPosition="right"
                                label="View Policy"
                                onClick={() =>
                                    navigate(
                                        `/enrollmenthistory/${leadsId}/${currentPolicy.confirmationNumber}/${currentPolicy.policyEffectiveDate}`,
                                        { state: policyData }
                                    )
                                }
                                type="tertiary"
                                className={styles.buttonWithIcon}
                            />
                        )}
                    </div>
                );
            }),
        [policies, isLife, navigate, leadsId]
    );

    return (
        <Modal open={showPolicyModal} onClose={handleModalClose} title={renderTitleComponent()}>
            <Box className={styles.container}>
                <Box className={styles.title}>{`${firstName} ${lastName}`}</Box>
                <div className={styles.ctaWrapper} onClick={() => navigate(`/contact/${leadsId}/overview`)}>
                    {isMobile ? (
                        <ArrowRight />
                    ) : (
                        <Button
                            icon={<ArrowRight />}
                            iconPosition="right"
                            label="View Contact"
                            type="tertiary"
                            className={styles.buttonWithIcon}
                        />
                    )}
                </div>
            </Box>
            <Box className={styles.content}>{policyCards}</Box>
        </Modal>
    );
};

PolicyDetailsModal.propTypes = {
    showPolicyModal: PropTypes.bool.isRequired,
    handleModalClose: PropTypes.func.isRequired,
    policyDetails: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        leadsId: PropTypes.string.isRequired,
        policy: PropTypes.oneOf(["LIFE", "HEALTH"]).isRequired,
    }).isRequired,
};

export default PolicyDetailsModal;
