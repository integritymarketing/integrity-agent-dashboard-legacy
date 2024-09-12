import React, {useState, useEffect, useRef, useLayoutEffect} from "react";
import { Box, Typography } from "@mui/material";
import ArrowDownBig from "components/icons/version-2/ArrowDownBig";
import styles from "./styles.module.scss";
import _ from "lodash";

import { useCampaignInvitation } from "providers/CampaignInvitation";
import ReUseFilters from "components/ReUseFilters";
import AutoCompleteContactSearchModal from "components/ChooseContactModal";
import CustomPopover from "components/CustomPopOver";
import EmailIcon from "../../icons/Marketing/emailIcon";
import TextIcon from "../../icons/version-2/TextIcon";
import InvitationBar from "../InvitationBar";
import InvitationCountBar from "../InvitationCountBar";
import PropTypes from "prop-types";

const channelOptions = [
    { optionText: "an email", value: "Email", icon: <EmailIcon /> },
    { optionText: "a text message", value: "Sms", icon: <TextIcon /> },
];

const CampaignFlowContainer = (props) => {
    const { showPreview, contactsTypeNotSelected } = props;
    const {
        invitationSendType,
        handleInvitationSendType,
        handleSummaryBarInfo,
        setSelectedContact,
        campaignInvitationData,
        createdNewCampaign,
        handleSetDefaultSelection,
        handleCampaignInvitationData,
        allCampaignInvitationData,
        eligibleContactsLength,
        campaignStatuses,
        getCampaignDetailsByEmail,
        getCampaignDetailsByText,
        isGetCampaignDetailsByEmailLoading,
        isGetCampaignDetailsByTextLoading
    } = useCampaignInvitation();

    const readOnly = createdNewCampaign?.campaignStatus === campaignStatuses.COMPLETED;

    const [channelOptionOpen, setChannelOptionOpen] = useState(null);
    const [emailOptionsOpen, setEmailOptionsOpen] = useState(null);
    const [chooseContactModalOpen, setChooseContactModalOpen] = useState(false);
    const [emailOptions, setEmailOptions] = useState([]);

    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const campaignDescs = allCampaignInvitationData.map((campaignInvitation)=> {
            return { optionText: campaignInvitation.campaignDescription, value: campaignInvitation };
        });
        setEmailOptions(campaignDescs)
    }, [allCampaignInvitationData, eligibleContactsLength]);
    const handleChannelOptionsChange = (value) => {
        setChannelOptionOpen(null);
        if(value === "Email") {
            getCampaignDetailsByEmail();
        }
        if(value === "Sms") {
            getCampaignDetailsByText();
        }
        handleInvitationSendType(value);
    };

    const handleEmailChannelOptionsChange = (value) => {
        setEmailOptionsOpen(null);
        handleCampaignInvitationData(value);
    };

    const handleCloseFilterDropdown = () => {
        const selectedFilterSections = JSON.parse(localStorage.getItem("campaign_contactList_selectedFilterSections"));
        setAnchorEl(null);
        if ((!selectedFilterSections || selectedFilterSections?.length === 0) || (selectedFilterSections?.length === 1 && !selectedFilterSections[0]?.selectedFilterOption)) {
            handleSetDefaultSelection();
        }
    };

    const handleChannelOptions = (event) => {
        setChannelOptionOpen(channelOptionOpen ? null : event.currentTarget);
    };

    const handleEmailChannelOptions = (event) => {
        setEmailOptionsOpen(emailOptionsOpen ? null : event.currentTarget);
    };

    const showEmailChannels = () => {
        return !_.isEmpty(invitationSendType);
    };

    const showInvitationBar = () => {
        return showEmailChannels() && !_.isEmpty(campaignInvitationData);
    };

    return (
        <Box className={styles.flowOptions} style={!showPreview && campaignInvitationData && !contactsTypeNotSelected ? { marginTop: 'auto' } : {}}>
            <Box className={`${styles.channelReasons} channelReasons`}>
                <Box className={`channelReasonsText`}>
                    <Typography variant="h3" className={styles.optionText}>
                        I want to send
                    </Typography>
                </Box>

                <Box
                    className={`${styles.option} channelOptions ${readOnly ? styles.disabled : ''}`}
                    onClick={!readOnly ? handleChannelOptions : undefined}
                >
                    <Typography className={styles.optionLink}>
                        {invitationSendType === "Email" && `an email`}
                        {invitationSendType === "Sms" && `a text message`}
                    </Typography>
                    {!readOnly && <ArrowDownBig width="40px" height="40px" />}

                    <CustomPopover
                        options={channelOptions}
                        anchorEl={channelOptionOpen}
                        handleAction={handleChannelOptionsChange}
                    />
                </Box>

                {showEmailChannels() && (
                    <Box
                        className={`${styles.option} reasonOptions ${readOnly ? styles.disabled : ''}`}
                        onClick={readOnly || isGetCampaignDetailsByEmailLoading || isGetCampaignDetailsByTextLoading ? undefined : handleEmailChannelOptions}
                    >
                        <Typography className={styles.optionLink}>
                            {campaignInvitationData === "" ? "" : campaignInvitationData.campaignDescription}
                        </Typography>
                        {!readOnly && <ArrowDownBig width="40px" height="40px" />}

                        <CustomPopover
                            options={emailOptions}
                            anchorEl={emailOptionsOpen}
                            handleAction={handleEmailChannelOptionsChange}
                        />
                    </Box>
                )}

                <ReUseFilters
                    anchorEl={anchorEl}
                    handleClose={handleCloseFilterDropdown}
                    handleSummaryBarInfo={handleSummaryBarInfo}
                    campaignId={campaignInvitationData?.id}
                />

                {!readOnly && chooseContactModalOpen && (
                    <AutoCompleteContactSearchModal
                        open={chooseContactModalOpen}
                        handleClose={() => setChooseContactModalOpen(false)}
                        handleCancel={() => {
                            setChooseContactModalOpen(false);
                            handleSetDefaultSelection();
                        }}
                        handleContactSelect={setSelectedContact}
                        title="Search for Contact"
                        subTitle="Search for a contact by name"
                        campaignId={campaignInvitationData?.id}
                        handleSetDefaultSelection={handleSetDefaultSelection}
                    />
                )}
            </Box>
            {showInvitationBar() && <InvitationBar />}
            {showPreview && <InvitationCountBar />}
        </Box>
    );
};

CampaignFlowContainer.propTypes = {
    showPreview: PropTypes.bool, // Determines whether to show the preview
    contactsTypeNotSelected: PropTypes.bool // Checks if contact type is not selected
};

export default CampaignFlowContainer;
