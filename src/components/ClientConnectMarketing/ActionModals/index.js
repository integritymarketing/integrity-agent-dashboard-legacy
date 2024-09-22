import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography, InputAdornment } from "@mui/material";
import { TextInput, CustomModal } from "components/MuiComponents";
import { useMarketing } from "providers/Marketing";
import styles from "./styles.module.scss";

const ActionModal = ({ campaignAction, open, onClose, campaign, refresh }) => {
    const { handleAllCampaignActions } = useMarketing();
    const { optionText, optionLabel } = campaignAction;

    const { customCampaignDescription: existingCampaignName } = campaign;

    const copyName = `${existingCampaignName} (Copy)`;

    const setNameBasedOnOption = optionText === "Copy" ? copyName : existingCampaignName;

    const [campaignName, setCampaignName] = useState(setNameBasedOnOption);
    const maxLength = 96;

    const handleInputChange = (event) => {
        setCampaignName(event.target.value);
    };

    const handleActionBtn = () => {
        if (optionText === "Copy") {
            const payload = {
                ...campaign,
                customCampaignDescription: campaignName,
                id: 0,
            };
            handleAllCampaignActions({ payload: payload, method: "post", refresh });
        }
        if (optionText === "Rename") {
            const payload = {
                ...campaign,
                customCampaignDescription: campaignName,
            };

            handleAllCampaignActions({ payload, method: "put", refresh });
        }
        if (optionText === "Send") {
            const payload = {
                ...campaign,
                campaignStatus: "Completed",
            };
            handleAllCampaignActions({ payload, method: "put", refresh });
        }

        if (optionText === "Delete") {
            handleAllCampaignActions({ payload: campaign, method: "delete", refresh });
        }
        setCampaignName("");
        onClose();
    };

    const disableSaveButton = useMemo(() => {
        if (optionText === "Rename" || optionText === "Copy") {
            return !campaignName || campaignName.length > maxLength || campaignName === existingCampaignName;
        }
        return false;
    }, [campaignName, optionText]);

    return (
        <CustomModal
            title={`${optionText} Campaign`}
            open={open}
            handleClose={onClose}
            footer
            handleSave={handleActionBtn}
            showCloseButton
            shouldShowCancelButton={true}
            isSaveButtonDisabled={disableSaveButton}
            maxWidth="sm"
            disableContentBackground
            saveLabel={optionText}
        >
            <Box className={styles.modalSubHeading}>
                <Typography variant="body1" gutterBottom>
                    {optionLabel}
                </Typography>
            </Box>
            {["Rename", "Copy"].includes(optionText) && (
                <Box className={styles.modalContent}>
                    <Typography variant="body1" gutterBottom>
                        Campaign Name
                    </Typography>

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
};

export default ActionModal;
