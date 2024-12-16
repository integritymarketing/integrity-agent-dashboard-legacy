import { useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import useDeviceType from "hooks/useDeviceType";
import ArrowRightIcon from "components/icons/version-2/ArrowRight";
import AnnouncementIcon from "components/icons/version-2/Announcement";
import Modal from "components/Modal";
import Styles from "./CampaignModal.module.scss";
import useAnalytics from "hooks/useAnalytics";
import CustomTagIcon from "components/icons/version-2/customTag";

const CampaignModal = ({ open, onClose, campaignList, leadData, view }) => {
    const navigate = useNavigate();
    const { fireEvent } = useAnalytics();
    const { isMobile } = useDeviceType();
    const handleViewContact = useCallback(() => {
        navigate(`/contact/${leadData.leadsId}/overview`);
    }, [leadData.leadsId, navigate]);
    const fullName = `${leadData?.firstName ?? ""} ${leadData?.middleName ?? ""} ${leadData?.lastName ?? ""}`;
    const removePrefix = (str) => {
        return str?.replace("Campaign ", "");
    };

    useEffect(() => {
        if (open) {
            const tagLabelsString = campaignList.map((campaign) => campaign.tag.tagLabel).join(", ");
            fireEvent("Contact List Tag Viewed", {
                leadid: leadData.leadsId,
                view,
                content: tagLabelsString,
                tag_category: "campaign",
            });
        }
    }, [open, fireEvent, campaignList, leadData.leadsId, view]);

    return (
        <Modal
            maxWidth="sm"
            open={open}
            onClose={onClose}
            title={
                <Box display="flex" alignItems={"center"}>
                    <span className={Styles.campaignTitleIcon}>
                        <AnnouncementIcon />
                    </span>
                    Campaigns
                </Box>
            }
            hideFooter={true}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px" width="100%">
                <Box className={Styles.name}>{fullName}</Box>
                <Box className={Styles.link} onClick={handleViewContact}>
                    {!isMobile && "View Contact"} <ArrowRightIcon />
                </Box>
            </Box>
            <Box>
                {campaignList?.map((campaign, index) => {
                    const { tag } = campaign;
                    const { tagCategory, tagLabel, metadata, tagIconUrl } = tag || {};
                    const { tagCategoryName } = tagCategory || {};

                    return (
                        <Box key={index} className={Styles.campaignCard}>
                            <Box className={Styles.campaignInfo}>
                                {tagIconUrl ? <img src={tagIconUrl} /> : <CustomTagIcon />}
                                <Box className={Styles.tagInfo}>
                                    <Box display="flex" alignItems="center">
                                        <Box className={Styles.tagCategoryName}>{removePrefix(tagCategoryName)}:</Box>
                                        <Box className={Styles.tagName}>{tagLabel}</Box>
                                    </Box>
                                    <Box className={Styles.tagMetaData}>{metadata}</Box>
                                </Box>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Modal>
    );
};

CampaignModal.propTypes = {
    open: PropTypes.bool.isRequired, // Indicates if the modal is currently open or not.
    onClose: PropTypes.func.isRequired, // Function to call when the modal needs to be closed.
    campaignList: PropTypes.arrayOf(
        PropTypes.shape({
            // List of campaign information to display in the modal.
            tag: PropTypes.shape({
                tagLabel: PropTypes.string, // Label of the campaign tag.
                metadata: PropTypes.string, // Metadata associated with the campaign tag.
            }),
        })
    ),
    leadData: PropTypes.shape({
        // Information about the lead related to the campaigns.
        leadsId: PropTypes.string.isRequired, // Unique identifier for the lead.
        firstName: PropTypes.string, // First name of the lead.
        middleName: PropTypes.string, // Middle name of the lead.
        lastName: PropTypes.string, // Last name of the lead.
    }).isRequired,
    view: PropTypes.string.isRequired, // Indicates if the modal is clicked from list or grid view
};

export default CampaignModal;
