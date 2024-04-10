import { useEffect, useState } from "react";
import { useWindowSize } from "hooks/useWindowSize";
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
    const { width: windowWidth } = useWindowSize();
    const navigate = useNavigate();
    const isLife = policy === "LIFE";
    const isMobile = windowWidth <= 784;
    const { getEnrollPlansList, enrollPlansList } = usePolicies();
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        if (leadsId) {
            getEnrollPlansList(leadsId);
        }
    }, [leadsId]);

    useEffect(() => {
        if (enrollPlansList.length > 0) {
            let filteredPolicy = [];
            if (isLife) {
                filteredPolicy = enrollPlansList.filter((policy) => policy.productCategory === "Final Expense");
            } else {
                filteredPolicy = enrollPlansList.filter((policy) => policy.productCategory !== "Final Expense");
            }
            setPolicies(filteredPolicy);
        }
    }, [enrollPlansList, isLife]);

    const renderTitleComp = () => {
        return (
            <Box className={styles.titleContainer}>
                {isLife ? <Life /> : <Health />}
                <Box className={styles.title}>{`${isLife ? "Life" : "Health"} Polices`}</Box>
            </Box>
        );
    }

    return (
        <>
            <Modal open={showPolicyModal} onClose={handleModalClose} title={renderTitleComp()}>
                <Box className={styles.container}>
                    <Box className={styles.title}>{`${firstName} ${lastName}`}</Box>
                    <div className={styles.ctaWrapper} onClick={() => {
                        navigate(`/contact/${leadsId}/overview`);
                    }} >
                        {isMobile ? <ArrowRight /> : <Button
                            icon={<ArrowRight />}
                            iconPosition="right"
                            label="View Contact"
                            type="tertiary"
                            className={styles.buttonWithIcon}
                        />}
                    </div>

                </Box>
                <Box className={styles.content}>
                    {policies.map(({ policyStatus, planName, hasPlanDetails, confirmationNumber, policyEffectiveDate }) => {
                        const status = policyStatus === "terminated" ? "Inactive" : capitalizeFirstLetter(policyStatus);
                        return <div className={styles.policyCard}>
                            <div className={styles.statusIcon}>
                                {isLife ? <LifePolicy status={status} /> : <HealthPolicy status={status} />}
                            </div>
                            <div className={styles.planContainer}>
                                <div className={styles.planName}>{planName}</div>
                                <div>
                                    <span className={styles.statusLabel}>Status:</span>
                                    <span className={styles.statusValue}>{status} </span>
                                </div>
                            </div>
                            {hasPlanDetails && <div className={styles.ctaWrapper} onClick={() => {
                                navigate(`/contact/${leadsId}/overview`);
                            }} >
                                {isMobile ? <OpenBlue /> : <Button
                                    icon={<OpenBlue />}
                                    iconPosition="right"
                                    label="View Policy"
                                    onClick={() => {
                                        navigate(`/enrollmenthistory/${leadsId}/${confirmationNumber}/${policyEffectiveDate}`, {
                                            state: policyDetails,
                                        })
                                    }}
                                    type="tertiary"
                                    className={styles.buttonWithIcon}
                                />}
                            </div>}
                        </div>
                    })}
                </Box>
            </Modal >
        </>
    );
};

PolicyDetailsModal.propTypes = {
    showPolicyModal: PropTypes.bool.isRequired,
    handleModalClose: PropTypes.func.isRequired
};

export default PolicyDetailsModal;