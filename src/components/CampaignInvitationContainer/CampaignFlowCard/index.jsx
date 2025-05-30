import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import ArrowDownBig from "components/icons/version-2/ArrowDownBig";
import styles from "./styles.module.scss";
import _ from "lodash";

import { useCampaignInvitation } from "providers/CampaignInvitation";
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

const CampaignFlowContainer = ({ showPreview, allSelected, readOnly }) => {
    const {
        campaignChannel,
        setCampaignChannel,
        allCampaignInvitationData,
        eligibleContactsLength,
        getCampaignDetailsByEmail,
        getCampaignDetailsByText,
        isFetchCampaignDetailsByEmailLoading,
        isFetchCampaignDetailsByTextLoading,
        isUpdateCampaignLoading,
        handleTemplateData,
        campaignDescriptionType,
        handleCreateOrUpdateCampaign,
        reset,
        resetThird,
        setAdvancedMode,
    } = useCampaignInvitation();

    const [channelOptionOpen, setChannelOptionOpen] = useState(null);
    const [emailOptionsOpen, setEmailOptionsOpen] = useState(null);
    const [emailOptions, setEmailOptions] = useState([]);

    useEffect(() => {
        const campaignDescriptions = allCampaignInvitationData.map((campaignInvitation) => ({
            optionText: campaignInvitation.campaignDescription,
            value: campaignInvitation,
        }));
        setEmailOptions(campaignDescriptions);
    }, [allCampaignInvitationData, eligibleContactsLength]);

    const handleChannelOptionsChange = (value) => {
        setChannelOptionOpen(null);
        reset();

        if (value === "Email") {
            getCampaignDetailsByEmail();
        } else if (value === "Sms") {
            getCampaignDetailsByText();
            setAdvancedMode(false);
        }

        setCampaignChannel(value);
        handleCreateOrUpdateCampaign({
            campaign_Channel: value,
            template_Id: "empty",
            campaign_ActionType: "empty",
            selectedCampaignId: "empty",
            template_Description: "empty",
        });
    };

    const handleEmailChannelOptionsChange = (value) => {
        setEmailOptionsOpen(null);
        handleTemplateData(value, true);
        resetThird();
        handleCreateOrUpdateCampaign({
            template_Id: value?.templateId,
            campaign_ActionType: "empty",
            selectedCampaignId: value?.id,
            template_Description: value?.templateDescription,
        });
    };

    const handleChannelOptions = (event) => {
        setChannelOptionOpen(channelOptionOpen ? null : event.currentTarget);
    };

    const handleEmailChannelOptions = (event) => {
        setEmailOptionsOpen(emailOptionsOpen ? null : event.currentTarget);
    };

    const showEmailChannels = () => !_.isEmpty(campaignChannel);

    const showInvitationBar = () => showEmailChannels() && !_.isEmpty(campaignDescriptionType);

    return (
        <Box className={styles.flowOptions} style={!showPreview && allSelected ? { marginTop: "auto" } : {}}>
            <Box className={styles.channelReasons}>
                <Box className={styles.channelReasonsText}>
                    <Typography variant="h3" className={styles.optionText}>
                        I want to send
                    </Typography>
                </Box>

                <Box
                    className={`${styles.option} ${styles.channelOptions} ${readOnly ? styles.disabled : ""}`}
                    onClick={
                        readOnly ||
                        isUpdateCampaignLoading ||
                        isFetchCampaignDetailsByEmailLoading ||
                        isFetchCampaignDetailsByTextLoading
                            ? undefined
                            : handleChannelOptions
                    }
                >
                    <Typography className={styles.optionLink}>
                        {campaignChannel === "Email" && "an email"}
                        {campaignChannel === "Sms" && "a text message"}
                    </Typography>
                    {!readOnly && <ArrowDownBig width="40px" height="40px" />}

                    <CustomPopover
                        options={channelOptions}
                        anchorEl={channelOptionOpen}
                        handleAction={handleChannelOptionsChange}
                        handleClose={() => setChannelOptionOpen(null)}
                        selected={
                            campaignChannel === "Email" ? "an email" : campaignChannel === "Sms" ? "a text message" : ""
                        }
                    />
                </Box>

                {showEmailChannels() && (
                    <Box
                        className={`${styles.bigOption} ${styles.reasonOptions} ${readOnly ? styles.disabled : ""}`}
                        onClick={
                            readOnly ||
                            isUpdateCampaignLoading ||
                            isFetchCampaignDetailsByEmailLoading ||
                            isFetchCampaignDetailsByTextLoading
                                ? undefined
                                : handleEmailChannelOptions
                        }
                    >
                        <Typography className={styles.bigOptionLink}>{campaignDescriptionType}</Typography>
                        {!readOnly && <ArrowDownBig width="40px" height="40px" />}

                        <CustomPopover
                            options={emailOptions}
                            anchorEl={emailOptionsOpen}
                            handleAction={handleEmailChannelOptionsChange}
                            handleClose={() => setEmailOptionsOpen(null)}
                            selected={campaignDescriptionType}
                        />
                    </Box>
                )}
            </Box>
            {showInvitationBar() && <InvitationBar readOnly={readOnly} />}
            {((showPreview && !readOnly && allSelected) || readOnly) && <InvitationCountBar readOnly={readOnly} />}
        </Box>
    );
};

CampaignFlowContainer.propTypes = {
    showPreview: PropTypes.bool, // Determines whether to show the preview
    allSelected: PropTypes.bool, // Checks if contact type is not selected
    readOnly: PropTypes.bool, // Determines if the component is read only
};

export default CampaignFlowContainer;
