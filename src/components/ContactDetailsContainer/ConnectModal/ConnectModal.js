import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { Direction, Email, Info, Navigate, Phone, Script, Soa } from "./Icons";
import styles from "./ConnectModal.module.scss";
import { CallScriptModal } from "packages/CallScriptModal";
import { formatAddress, getMapUrl } from "utils/address";
import Modal from "components/Modal";
import { formatPhoneNumber } from "utils/phones";

const NOT_AVAILABLE = "N/A";

export const ConnectModal = ({ open, onClose, leadId, leadDetails }) => {
    const navigate = useNavigate();
    const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
    const { firstName = "", lastName = "", emails = [], phones = [], addresses = [] } = leadDetails || {};
    const fullName = `${firstName} ${lastName}`;
    const email = emails.length > 0 ? emails?.[0] : NOT_AVAILABLE;
    const validPhones = phones?.filter((phone) => {
        return phone?.leadPhone && phone?.leadPhone !== "" ? phone : null;
    });
    const phone = validPhones?.length > 0 ? formatPhoneNumber(validPhones[0]) : NOT_AVAILABLE;
    const address = addresses?.length > 0 ? formatAddress(addresses[0]) : NOT_AVAILABLE;

    return (
        <>
            {!isScriptModalOpen && open && (
                <Modal maxWidth="xs" open={open} onClose={onClose} hideFooter title="Connect">
                    <Box className={styles.connectModalBody}>
                        <div className={styles.leadName}>{fullName}</div>
                        <Box className={styles.connectList}>
                            {/* Phone option */}
                            <Box className={styles.connectOption}>
                                <div className={styles.iconOne}>
                                    <Phone />
                                </div>
                                <div className={styles.connectName}>Call</div>
                                <div className={`${styles.iconTwo} ${phone === NOT_AVAILABLE ? styles.disabled : ""}`}>
                                    <a href={`tel:${phone}`}>
                                        <Navigate />
                                    </a>
                                </div>
                            </Box>
                            {/* Email option */}
                            <Box className={styles.connectOption}>
                                <div className={styles.iconOne}>
                                    <Email />
                                </div>
                                <div className={styles.connectName}>Email</div>
                                <div className={`${styles.iconTwo} ${email === NOT_AVAILABLE ? styles.disabled : ""}`}>
                                    <a href={`mailto:${email}`}>
                                        <Navigate />
                                    </a>
                                </div>
                            </Box>
                            {/* Directions option */}
                            {/* <Box className={styles.connectOption}>
                                <div className={styles.iconOne}>
                                    <Direction />
                                </div>
                                <div className={styles.connectName}>Directions</div>
                                <div className={styles.iconTwo} onClick={() => window.open(getMapUrl(address))}>
                                    <Navigate />
                                </div>
                            </Box> */}
                            {/* Call Script option */}
                            <Box className={styles.connectOption}>
                                <div className={styles.iconOne}>
                                    <Script />
                                </div>
                                <div className={styles.connectName}>Call Script</div>
                                <div className={styles.iconTwo} onClick={() => setIsScriptModalOpen(true)}>
                                    <Navigate />
                                </div>
                            </Box>
                        </Box>
                        <Box className={styles.connectSOA}>
                            <Box className={styles.connectOption}>
                                <div className={styles.iconOne}>
                                    <Soa />
                                </div>
                                <div className={styles.connectName}>Scopes of Appointment</div>
                                {/* <div className={styles.infoIcon}>
                                    <Info />
                                </div> */}
                                <div
                                    className={styles.iconTwo}
                                    onClick={() =>
                                        navigate({
                                            pathname: `/contact/${leadId}`,
                                            search: "?awaiting=true",
                                        })
                                    }
                                >
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
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    leadId: PropTypes.string.isRequired,
    leadDetails: PropTypes.object.isRequired,
};
