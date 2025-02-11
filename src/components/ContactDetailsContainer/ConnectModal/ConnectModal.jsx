import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import useAgentInformationByID from "hooks/useAgentInformationByID";
import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";
import useAnalytics from "hooks/useAnalytics";

import { CallScriptModal } from "packages/CallScriptModal";

import Modal from "components/Modal";

import styles from "./ConnectModal.module.scss";
import { Email, Navigate, Phone, Script, Soa } from "./Icons";

const NOT_AVAILABLE = "N/A";

export const ConnectModal = ({ isOpen, onClose, leadId, leadDetails }) => {
    const navigate = useNavigate();
    const { agentInformation } = useAgentInformationByID();
    const { agentID, callForwardNumber, agentVirtualPhoneNumber, agentNPN } = agentInformation || {};
    const showToast = useToast();
    const { fireEvent } = useAnalytics();
    const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);

    const formattedPhoneNumber = agentVirtualPhoneNumber?.replace(/^\+1/, "");
    const { Post: outboundCallFromMedicareCenter } = useFetch(
        `${import.meta.env.VITE_COMMUNICATION_API}/Call/CallCustomer`
    );
    const {
        firstName = "",
        lastName = "",
        emails = [],
        phones = [],
        addresses = [],
        leadTags = [],
        statusName = "",
        plan_enroll_profile_created,
    } = leadDetails || {};
    const fullName = `${firstName} ${lastName}`;
    const email = emails.length > 0 ? emails[0]?.leadEmail : NOT_AVAILABLE;
    const validPhones = phones.filter((phone) => phone?.leadPhone);
    const phone = validPhones.length > 0 ? validPhones?.[0]?.leadPhone : NOT_AVAILABLE;

    const handleSoaNavigation = useCallback(() => {
        navigate(`/contact/${leadId}/communications?tab=scope-of-appointment`);
        onClose();
    }, [leadId, navigate, onClose]);

    const handleCall = useCallback(async () => {
        if (phone !== NOT_AVAILABLE) {
            const payload = {
                agentId: agentID,
                leadId,
                agentTwilioNumber: formattedPhoneNumber,
                agentPhoneNumber: callForwardNumber,
                customerNumber: phone,
                agentNPN,
            };
            try {
                await outboundCallFromMedicareCenter(payload);
                showToast({
                    type: "success",
                    message: "Call Initiated Successfully",
                });
                setIsScriptModalOpen(true);
                fireEvent("Outbound Call", {
                    leadid: leadId,
                    tags: leadTags,
                    stage: statusName,
                    plan_enroll_profile_created,
                });
            } catch (error) {
                showToast({
                    type: "error",
                    message: "Error initiating call. Please try again.",
                });
            }
        }
    }, [
        agentID,
        callForwardNumber,
        formattedPhoneNumber,
        agentNPN,
        phone,
        outboundCallFromMedicareCenter,
        showToast,
        setIsScriptModalOpen,
    ]);

    const handleEmail = useCallback(() => {
        if (email !== NOT_AVAILABLE) {
            window.location.href = `mailto:${email}`;
        }
    }, [email]);

    return (
        <>
            {!isScriptModalOpen && isOpen && (
                <Modal maxWidth="xs" open={isOpen} onClose={onClose} hideFooter title="Contact">
                    <Box className={styles.connectModalBody}>
                        <div className={styles.leadName}>{fullName}</div>
                        <Box className={styles.connectList}>
                            {/* Phone option */}
                            <Box
                                className={`${styles.connectOption} ${phone === NOT_AVAILABLE ? styles.disabled : ""}`}
                                onClick={handleCall}
                            >
                                <div className={styles.iconOne}>
                                    <Phone />
                                </div>
                                <div className={styles.connectName}>Call</div>
                                <div className={styles.iconTwo}>
                                    <Navigate />
                                </div>
                            </Box>
                            {/* Email option */}
                            <Box
                                className={`${styles.connectOption} ${email === NOT_AVAILABLE ? styles.disabled : ""}`}
                                onClick={handleEmail}
                            >
                                <div className={styles.iconOne}>
                                    <Email />
                                </div>
                                <div className={styles.connectName}>Email</div>
                                <div className={styles.iconTwo}>
                                    <Navigate />
                                </div>
                            </Box>
                            {/* Call Script option */}
                            <Box className={styles.connectOption} onClick={() => setIsScriptModalOpen(true)}>
                                <div className={styles.iconOne}>
                                    <Script />
                                </div>
                                <div className={styles.connectName}>Call Script</div>
                                <div className={styles.iconTwo}>
                                    <Navigate />
                                </div>
                            </Box>
                        </Box>
                        <Box className={styles.connectSOA}>
                            <Box className={styles.connectOption} onClick={handleSoaNavigation}>
                                <div className={styles.iconOne}>
                                    <Soa />
                                </div>
                                <div className={styles.connectName}>Scopes of Appointment</div>
                                <div className={styles.iconTwo}>
                                    <Navigate />
                                </div>
                            </Box>
                        </Box>
                    </Box>
                </Modal>
            )}
            {isScriptModalOpen && (
                <CallScriptModal
                    modalOpen={isScriptModalOpen}
                    handleClose={() => setIsScriptModalOpen(false)}
                    leadId={leadId}
                    countyFips={addresses?.[0]?.countyFips}
                    postalCode={addresses?.[0]?.postalCode}
                />
            )}
        </>
    );
};

ConnectModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    leadId: PropTypes.string.isRequired,
    leadDetails: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        emails: PropTypes.arrayOf(PropTypes.string),
        phones: PropTypes.arrayOf(
            PropTypes.shape({
                leadPhone: PropTypes.string,
            })
        ),
        addresses: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
};

export default ConnectModal;
