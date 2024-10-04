import { useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

import ArrowRight from "components/icons/version-2/ArrowRight";
import AskIntegrity from "components/icons/version-2/AskIntegrity";
import ShoppersCard from "components/Shoppers/ShoppersCard";

import Modal from "components/Modal";
import useDeviceType from "hooks/useDeviceType";
import useAnalytics from "hooks/useAnalytics";

import styles from "./AskIntegrityModal.module.scss";

const AskIntegrityModal = ({ open, onClose, askIntegrityList, leadData, view }) => {
    const navigate = useNavigate();
    const { fireEvent } = useAnalytics();
    const { isMobile } = useDeviceType();

    useEffect(() => {
        if (open) {
            const askIntegrityLabelsString = askIntegrityList.map((tagInfo) => tagInfo.tag.tagLabel).join(", ");
            fireEvent("Contact List Tag Viewed", {
                leadid: leadData.leadsId,
                view,
                content: askIntegrityLabelsString,
                tag_category: "ask_integrity",
            });
        }
    }, [open, fireEvent, askIntegrityList, leadData.leadsId, view]);

    const onViewContactHandle = useCallback(() => {
        navigate(`/contact/${leadData.leadsId}/overview`);
    }, [leadData.leadsId, navigate]);

    const fullName = `${leadData?.firstName ?? ""} ${leadData?.middleName ?? ""} ${leadData?.lastName ?? ""}`;

    const AIS_List = askIntegrityList?.filter(
        (item) => item?.tag?.tagCategory?.tagCategoryName === "Ask Integrity Suggests"
    );
    const AIR_List = askIntegrityList?.filter(
        (item) => item?.tag?.tagCategory?.tagCategoryName === "Ask Integrity Recommendations"
    );

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
            hideFooter={true}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px" width="100%">
                <Box className={styles.name}>{fullName}</Box>
                <Box className={styles.link} onClick={onViewContactHandle}>
                    {!isMobile && "View Contact"} <ArrowRight />
                </Box>
            </Box>
            <Box>
                {AIS_List?.map((tagInfo, index) => (
                    <Box key={`AIS-${index}`}>
                        <ShoppersCard
                            leadId={leadData?.leadsId}
                            title={tagInfo?.tag?.tagLabel}
                            content={tagInfo?.tag?.metadata}
                            url={tagInfo?.interactionUrl}
                            icon={tagInfo?.tag?.tagIconUrl}
                        />
                    </Box>
                ))}
                {AIR_List?.map((tagInfo, index) => (
                    <Box key={`AIR-${index}`} className={styles.askIntegrityCard}>
                        <Box className={styles.askIntegrityInfo}>
                            <Box>
                                {tagInfo?.tag?.tagIconUrl ? <img src={tagInfo?.tag?.tagIconUrl} /> : <AskIntegrity />}
                            </Box>
                            <Box className={styles.tagInfo}>
                                <Box className={styles.tagName}>{tagInfo?.tag?.tagLabel}</Box>
                                <Box className={styles.tagMetaData}>{tagInfo?.tag?.metadata}</Box>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Modal>
    );
};

AskIntegrityModal.propTypes = {
    open: PropTypes.bool.isRequired, // Indicates if the modal is open or not
    onClose: PropTypes.func.isRequired, // Function to call on modal close
    askIntegrityList: PropTypes.array, // List of integrity suggestions
    leadData: PropTypes.object.isRequired, // Lead data including names and ID
    view: PropTypes.string.isRequired, // View name list and grid
};

export default AskIntegrityModal;
