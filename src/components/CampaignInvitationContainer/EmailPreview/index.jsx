import React, { useState } from "react";
import { Box, Grid, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import emailPreviewStyles from "./styles.module.scss";
import PreviewIcon from "components/icons/Marketing/previewIcon";
import { useCampaignInvitation } from "providers/CampaignInvitation";

const EmailPreview = () => {
    const { templateImageUrl } = useCampaignInvitation();

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Grid item md={6} xs={12} className={emailPreviewStyles.imagePreview}>
                <Box className={emailPreviewStyles.imageContainer}>
                    <img src={templateImageUrl} alt="PlanEnroll Campaign" title="PlanEnroll Campaign" />
                    <Box className={emailPreviewStyles.iconContainer} onClick={handleOpen}>
                        <PreviewIcon />
                    </Box>
                </Box>
            </Grid>

            <Modal size="xl" open={open} onClose={handleClose} className={emailPreviewStyles.modalStyles}>
                <Box className={emailPreviewStyles.modalContent}>
                    <IconButton className={emailPreviewStyles.closeButton} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                    <img src={templateImageUrl} alt="PlanEnroll Campaign" />
                </Box>
            </Modal>
        </>
    );
};

export default EmailPreview;
