import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Modal from "components/Modal";
import styles from "./LifePolicyModal.module.scss";
import { Button } from "components/ui/Button";
import ArrowRight from "components/icons/version-2/ArrowRight";
import { usePolicies } from "providers/ContactDetails";
import LifePolicy from "components/LifePolicy";
import { capitalizeFirstLetter } from "utils/shared-utils/sharedUtility";

const LifePolicyDetailsModal = ({ showLifePolicyModal, handleModalClose, lifePolicyDetails }) => {
    const { firstName, lastName, leadsId } = lifePolicyDetails;
    const { getEnrollPlansList, enrollPlansList } = usePolicies();
    const [lifePolicies, setLifePolicies] = useState([]);

    useEffect(() => {
        if (leadsId) {
            getEnrollPlansList(leadsId);
        }
    }, [leadsId]);

    useEffect(() => {
        if (enrollPlansList.length > 0) {
            const lifePolicy = enrollPlansList.filter((policy) => policy.productCategory
                === "Final Expense");
            setLifePolicies(lifePolicy);
        }
    }, [enrollPlansList]);
    console.log(leadsId, enrollPlansList);
    return (
        <>
            <Modal open={showLifePolicyModal} onClose={handleModalClose} hideFooter title="Life Policies">
                <Box className={styles.container}>
                    <Box className={styles.title}>{`${firstName} ${lastName}`}</Box>
                    <Button
                        icon={<ArrowRight />}
                        iconPosition="right"
                        label="View Contact"
                        onClick={() => {
                            setIsAddNewModalOpen(true);
                        }}
                        type="tertiary"
                        className={styles.buttonWithIcon}
                    />
                </Box>
                <Box className={styles.content}>
                    {lifePolicies.map(({ policyStatus, planName }) => {
                        const status = policyStatus === "terminated" ? "Inactive" : capitalizeFirstLetter(policyStatus);
                        return <div className={styles.policyCard}>
                            <div className={styles.statusIcon}>
                                <LifePolicy status={status} />
                            </div>
                            <div>
                                <div className={styles.planName}>{planName}</div>
                                <div className={styles.status}>
                                    <span className={styles.statusLabel}>Status:</span>
                                    <span className={styles.statusValue}>{status} </span>
                                </div>
                            </div>
                        </div>
                    })}
                </Box>
            </Modal>
        </>
    );
};

LifePolicyDetailsModal.propTypes = {
    showLifePolicyModal: PropTypes.bool.isRequired, // Determines if the modal is open
    handleModalClose: PropTypes.func.isRequired, // Function to call when closing the modal
};

export default LifePolicyDetailsModal;