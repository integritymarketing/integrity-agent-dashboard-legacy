import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography, InputAdornment } from "@mui/material";
import { TextInput, CustomModal } from "components/MuiComponents";
import { useMarketing } from "providers/Marketing";
import {
    ActionsCopy,
    ActionsRename,
    ActionsDelete,
    ActionsSend,
    ActionsPause,
    ActionsStart,
    ActionsEnd,
} from "@integritymarketing/icons";
import styles from "./styles.module.scss";

const ActionModal = ({ campaignAction, open, onClose, campaign, refresh, campaignDescription }) => {
    const { handleAllCampaignActions } = useMarketing();
    const { optionText, optionLabel } = campaignAction;

    const { customCampaignDescription: existingCampaignName, campaignStatus } = campaign;

    const copyName = `${existingCampaignName} (Copy)`;

    const setNameBasedOnOption = optionText === "Copy" ? copyName : existingCampaignName;

    const [campaignName, setCampaignName] = useState(setNameBasedOnOption);
    const maxLength = 96;

    const handleInputChange = (event) => {
        setCampaignName(event.target.value);
    };

    const createPayload = (campaign, campaignName, overrides) => ({
        ...campaign,
        customCampaignDescription: campaignName,
        ...overrides,
    });

    const handleCustomFilter = (payload) => {
        if (
            (payload?.campaignSelectedAction === "contacts filtered by…" ||
                payload?.campaignSelectedAction === "a contact when") &&
            payload?.customFilter !== ""
        ) {
            try {
                const parsedFilter = JSON.parse(payload.customFilter);
                const data = parsedFilter ? JSON.parse(parsedFilter) : null;
                payload.customFilter = data ? JSON.stringify(data) : "";
            } catch (error) {
                payload.customFilter = "";
            }
        }
    };

    const getPayloadAndMethod = (optionText, campaign, campaignName) => {
        let payload;
        let method;

        switch (optionText) {
            case "Copy":
                payload = createPayload(campaign, campaignName, { campaignStatus: "Draft", id: 0 });
                method = "post";
                break;
            case "Rename":
                payload = createPayload(campaign, campaignName);
                method = "put";
                break;
            case "Send":
                payload = createPayload(campaign, campaignName, { campaignStatus: "Submitted" });
                method = "put";
                break;
            case "Start":
                payload = createPayload(campaign, campaignName, { campaignStatus: "Submitted", campaignType: "Event" });
                method = "put";
                break;
            case "Pause":
                payload = createPayload(campaign, campaignName, { campaignStatus: "Paused" });
                method = "put";
                break;
            case "Resume":
                payload = createPayload(campaign, campaignName, { campaignStatus: "Active" });
                method = "put";
                break;
            case "End":
                payload = createPayload(campaign, campaignName, { campaignStatus: "Completed" });
                method = "put";
                break;
            case "Delete":
                payload = campaign;
                method = "delete";
                break;
            default:
                return {};
        }

        handleCustomFilter(payload);
        return { payload, method };
    };

    const handleActionButton = () => {
        const { payload, method } = getPayloadAndMethod(optionText, campaign, campaignName);

        if (!payload || !method) return;

        handleAllCampaignActions({ payload, method, refresh, campaignDescription });
        setCampaignName("");
        onClose();
    };

    const saveIcon = useMemo(() => {
        switch (optionText) {
            case "Copy":
                return <ActionsCopy color="#ffffff" />;
            case "Rename":
                return <ActionsRename color="#ffffff" />;
            case "Send":
                return <ActionsSend color="#ffffff" />;
            case "Delete":
                return <ActionsDelete color="#ffffff" />;
            case "Pause":
                return <ActionsPause color="#ffffff" />;
            case "Start":
                return <ActionsStart color="#ffffff" />;
            case "End":
                return <ActionsEnd color="#ffffff" />;
            case "Resume":
                return <ActionsStart color="#ffffff" />;
            default:
                return null;
        }
    }, [optionText]);

    const disableSaveButton = useMemo(() => {
        if (optionText === "Rename" || optionText === "Copy") {
            return !campaignName || campaignName.length > maxLength || campaignName === existingCampaignName;
        }
        return false;
    }, [campaignName, existingCampaignName, optionText]);

    const { title, saveButtonLabel } = useMemo(() => {
        if (optionText === "Delete") {
            return {
                title: `Delete ${campaignStatus} Campaign`,
                saveButtonLabel: `Delete this ${campaignStatus} Campaign`,
            };
        } else if (optionText === "Send") {
            return {
                title: "Send Campaign",
                saveButtonLabel: "Send this Campaign",
            };
        } else {
            return {
                title: `${optionText} Campaign`,
                saveButtonLabel: optionText,
            };
        }
    }, [optionText, campaignStatus]);

    return (
        <CustomModal
            title={title}
            open={open}
            handleClose={onClose}
            footer
            handleSave={handleActionButton}
            showCloseButton
            shouldShowCancelButton={true}
            isSaveButtonDisabled={disableSaveButton}
            maxWidth="sm"
            disableContentBackground
            saveLabel={saveButtonLabel}
            footerActionIcon={saveIcon}
        >
            <Box className={styles.modalSubHeading}>
                <Typography className={styles.campaignLabel}>{optionLabel}</Typography>
            </Box>
            {["Rename", "Copy"].includes(optionText) && (
                <Box className={styles.modalContent}>
                    <Typography className={styles.campaignName}>Campaign Name</Typography>

                    <TextInput
                        fullWidth
                        variant="outlined"
                        value={campaignName}
                        onChange={handleInputChange}
                        inputProps={{ maxLength: maxLength }}
                        label={""}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Typography variant="body1">{`${campaignName.length}/${maxLength}`}</Typography>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            )}
        </CustomModal>
    );
};

ActionModal.propTypes = {
    campaignAction: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    campaign: PropTypes.object.isRequired,
    refresh: PropTypes.func.isRequired,
    campaignDescription: PropTypes.string,
};

export default ActionModal;
