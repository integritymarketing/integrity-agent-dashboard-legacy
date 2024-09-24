import { useState } from "react";
import PropTypes from "prop-types";
import { Box, IconButton } from "@mui/material";
import Popover from "@mui/material/Popover";
import styles from "./styles.module.scss";
import ActionModal from "../ActionModals";
import { ActionsCopy, ActionsRename, ActionsDelete, ActionsSend } from "@integritymarketing/icons";

const campaignOperations = [
    { optionText: "Rename", value: "rename", optionLabel: "Edit campaign name." },
    {
        optionText: "Send",
        value: "send",
        optionLabel: "Are you sure you want to send this campaign? Sent messages cannot be unsent.",
    },
    {
        optionText: "Copy",
        value: "copy",
        optionLabel: "Give your campaign a new name and then select create.",
    },
    {
        optionText: "Delete",
        value: "delete",
        optionLabel: "Are you sure you want to delete this draft? This action cannot be undone.",
    },
];

const ActionPopover = ({ anchorEl, onClose, campaign, refresh }) => {
    const open = Boolean(anchorEl);
    const id = anchorEl ? "simple-popover-actions" : undefined;
    const { campaignChannel, requestPayload, campaignSelectedAction, campaignStatus, customCampaignDescription } =
        campaign;

    const [campaignAction, setCampaignAction] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleActionModalOpen = (actionOptions) => {
        setModalOpen(true);
        setCampaignAction(actionOptions);
    };
    const onCloseActionModal = () => {
        setModalOpen(false);
        setCampaignAction(null);
        onClose();
    };

    const isCampaignCanStarted =
        campaignChannel && campaignSelectedAction && requestPayload?.templateId && requestPayload?.leads?.length > 0;

    const showIcon = (optionText, disable) => {
        if (optionText === "Copy") {
            return <ActionsCopy size="md" className={styles.actionIcon} color={disable ? "#00000061" : "#4178FF"} />;
        }
        if (optionText === "Rename") {
            return <ActionsRename size="md" className={styles.actionIcon} color={disable ? "#00000061" : "#4178FF"} />;
        }
        if (optionText === "Send") {
            return <ActionsSend size="md" className={styles.actionIcon} color={disable ? "#00000061" : "#4178FF"} />;
        }
        if (optionText === "Delete") {
            return <ActionsDelete size="md" className={styles.actionIcon} color={disable ? "#00000061" : "#4178FF"} />;
        }
    };

    return (
        <>
            <Popover
                className={styles.customPopover}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={onClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                sx={{
                    ".MuiPaper-root": { borderRadius: "8px" },
                }}
            >
                {campaignOperations
                    .filter((item) => (campaignStatus === "Completed" ? item.value == "copy" : true))
                    ?.map((campaignObj, index) => {
                        const isSendDisable = campaignObj.value === "send" && !isCampaignCanStarted;
                        return (
                            <>
                                <Box
                                    sx={{ display: "flex", padding: "8px" }}
                                    className={`  ${isSendDisable ? styles.disabledRow : ""}`}
                                    key={index}
                                >
                                    <Box className={styles.actionIcons}>
                                        <IconButton
                                            size="lg"
                                            className={`${styles.roundedIcon} ${isSendDisable ? styles.disable : ""}`}
                                        >
                                            {showIcon(campaignObj.optionText, isSendDisable)}
                                        </IconButton>
                                    </Box>
                                    <Box
                                        className={styles.selections}
                                        onClick={() => {
                                            if (isSendDisable) {
                                                return;
                                            } else {
                                                handleActionModalOpen(campaignObj);
                                            }
                                        }}
                                    >
                                        {campaignObj.optionText}
                                    </Box>
                                </Box>
                                {campaignObj.value == "copy" && <Box className={styles.cardDivider} />}
                            </>
                        );
                    })}
            </Popover>
            {modalOpen && (
                <ActionModal
                    open={modalOpen}
                    onClose={onCloseActionModal}
                    campaignAction={campaignAction}
                    campaign={campaign}
                    refresh={refresh}
                />
            )}
        </>
    );
};

ActionPopover.propTypes = {
    anchorEl: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    campaign: PropTypes.object.isRequired,
    refresh: PropTypes.func.isRequired,
};

export default ActionPopover;
