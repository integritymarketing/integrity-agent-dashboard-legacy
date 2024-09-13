import { useState, useCallback } from "react";
import { Typography, Box, Button } from "@mui/material";
import styles from "./styles.module.scss";
import PlusIcon from "images/Campaigns/icons-Plus.svg";
import { useCampaignInvitation } from "providers/CampaignInvitation";
import WithLoader from "components/ui/WithLoader";
import CreateCampaignModal from "../../CampaignInvitationContainer/CreateCampaignModal";

const CampaignSubHeader = () => {
    const {
        reset,
        handleCreateOrUpdateCampaign,
        setCampaignDescription,
        isCreateCampaignRequestInProgress,
        campaignStatuses,
        isCreateCampaignModalOpen,
        setIsCreateCampaignModalOpen,
    } = useCampaignInvitation();

    const initiateCampaign = () => {
        reset();
        setIsCreateCampaignModalOpen(true);
    };

    const handleOnSave = useCallback(() => {
        handleCreateOrUpdateCampaign(campaignStatuses.DRAFT, "/marketing/campaign-invitation");
    }, [handleCreateOrUpdateCampaign, campaignStatuses]);

    return (
        <Box className={styles.campaignSubHeader}>
            <Box className={styles.campaignHeader}>
                <Typography variant="h2">Client Connect Marketing</Typography>
            </Box>

            <Box className={styles.newCampaignButton}>
                <Button
                    size="medium"
                    variant="contained"
                    color="primary"
                    endIcon={<img src={PlusIcon} alt="Plus Icon" />}
                    onClick={initiateCampaign}
                >
                    New Campaign
                </Button>
            </Box>
            <WithLoader isLoading={isCreateCampaignRequestInProgress}>
                {isCreateCampaignModalOpen && (
                    <CreateCampaignModal
                        isModalOpen={isCreateCampaignModalOpen}
                        setIsModalOpen={setIsCreateCampaignModalOpen}
                        onSave={handleOnSave}
                        actionButtonName="Create"
                        cancelButtonName="Cancel"
                        onTextChange={(value) => setCampaignDescription(value)}
                    />
                )}
            </WithLoader>
        </Box>
    );
};

export default CampaignSubHeader;
