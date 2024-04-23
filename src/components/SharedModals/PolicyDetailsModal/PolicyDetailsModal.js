import { useEffect, useState, useMemo } from "react";
import useAnalytics from "hooks/useAnalytics";
import useDeviceType from "hooks/useDeviceType";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Modal from "components/Modal";
import Styles from "./PolicyDetailsModal.module.scss";
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

// eslint-disable-next-line max-lines-per-function
const PolicyDetailsModal = ({ showPolicyModal, handleModalClose, policyDetails, view }) => {
    const { firstName, lastName, leadsId, policy } = policyDetails;
    const { isMobile } = useDeviceType();
    const { fireEvent } = useAnalytics();
    const navigate = useNavigate();
    const isLife = policy === "LIFE";
    const { getEnrollPlansList, enrollPlansList } = usePolicies();
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        if (policies.length > 0) {
            fireEvent("Contact List Tag Viewed", {
                leadid: policies[0].leadId,
                view,
                tag_category: isLife ? "life" : "health",
                content: policies.map((policy) => policy.planName).join(", ")
            });
        }
    }, [policies])

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
        <Box className={Styles.titleContainer}>
            {isLife ? <Life /> : <Health />}
            <Box className={Styles.title}>{`${isLife ? "Life" : "Health"} Policies`}</Box>
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

                const isDeclinedStatus = (policyStatus) => {
                    return policyStatus === "declined" || policyStatus === "inactive";
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
                    <div key={currentPolicy.policyNumber} className={Styles.policyCard}>
                        <div className={Styles.statusIcon}>
                            {isLife ? <LifePolicy status={status} /> : <HealthPolicy status={status} />}
                        </div>
                        <div className={Styles.planContainer}>
                            <div className={Styles.planName}>{currentPolicy.planName}</div>
                            <div>
                                <span className={Styles.statusLabel}>Status:</span>
                                <span className={Styles.statusValue}>{status}</span>
                            </div>
                        </div>
                        {currentPolicy.hasPlanDetails && (
                            <div
                                className={Styles.ctaWrapper}
                                onClick={() =>
                                    navigate(
                                        `/enrollmenthistory/${leadsId}/${currentPolicy.confirmationNumber}/${currentPolicy.policyEffectiveDate}`,
                                        { state: policyData }
                                    )
                                }
                            >
                                {isMobile ? (
                                    <OpenBlue />
                                ) : (
                                    <Button
                                        icon={<OpenBlue />}
                                        iconPosition="right"
                                        label="View Policy"
                                        type="tertiary"
                                        className={Styles.buttonWithIcon}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                );
            }),
        [policies, leadsId, isLife, isMobile, navigate]
    );

    return (
        <Modal open={showPolicyModal} onClose={handleModalClose} hideFooter={true} title={renderTitleComponent()}>
            <Box className={Styles.container}>
                <Box className={Styles.title}>{`${firstName} ${lastName}`}</Box>
                <div className={Styles.ctaWrapper} onClick={() => navigate(`/contact/${leadsId}/overview`)}>
                    {isMobile ? (
                        <ArrowRight />
                    ) : (
                        <Button
                            icon={<ArrowRight />}
                            iconPosition="right"
                            label="View Contact"
                            type="tertiary"
                            className={Styles.buttonWithIcon}
                        />
                    )}
                </div>
            </Box>
            <Box className={Styles.content}>{policyCards}</Box>
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