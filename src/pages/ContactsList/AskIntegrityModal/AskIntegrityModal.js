/* eslint-disable max-lines-per-function */
import { useCallback } from "react";

import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import ArrowRight from "components/icons/version-2/ArrowRight";

import Modal from "components/Modal";

import AskIntegrity from "components/icons/version-2/AskIntegrity";

import styles from "./AskIntegrityModal.module.scss";

const AskIntegrityModal = ({ open, onClose, askIntegrityList, leadData, isMobile }) => {
    const navigate = useNavigate();
    const onViewContactHandle = useCallback(() => {
        navigate(`/contact/${leadData.leadsId}/overview`);
    }, [leadData.leadsId, navigate]);

    const name = `${leadData?.firstName ?? ""} ${leadData?.middleName ?? ""} ${leadData?.lastName ?? ""}`;

    return (
        <Modal
            maxWidth="sm"
            open={open}
            onClose={onClose}
            title={
                <Box display="flex">
                    <span className={styles.askIntegrityTitleIcon}>
                        <AskIntegrity />
                    </span>
                    Ask Integrity Suggests
                </Box>
            }
        >
            <>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    marginBottom={"20px"}
                    width={"100%"}
                >
                    <Box className={styles.name}>{name}</Box>
                    <Box className={styles.link} onClick={onViewContactHandle}>
                        {!isMobile && <>View Contact</>} <ArrowRight />
                    </Box>
                </Box>
                <Box>
                    {askIntegrityList?.map((tagInfo) => {
                        const tagLabel = tagInfo?.tag?.tagLabel;
                        const metadata = tagInfo?.tag?.metadata;
                        return (
                            <Box className={styles.askIntegrityCard}>
                                <Box className={styles.askIntegrityInfo}>
                                    <Box>
                                        <AskIntegrity />
                                    </Box>
                                    <Box className={styles.tagInfo}>
                                        <Box className={styles.tagName}>{tagLabel}</Box>
                                        <Box className={styles.tagMetaData}>{metadata}</Box>
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </>
        </Modal>
    );
};

export default AskIntegrityModal;
