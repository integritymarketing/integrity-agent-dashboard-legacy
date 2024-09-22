import { useCallback } from "react";
import { Typography, Box, Button } from "@mui/material";
import styles from "./styles.module.scss";
import PlusIcon from "images/Campaigns/icons-Plus.svg";
import { useCampaignInvitation } from "providers/CampaignInvitation";
import WithLoader from "components/ui/WithLoader";
import CreateCampaignModal from "../../CampaignInvitationContainer/CreateCampaignModal";

const CampaignSubHeader = () => {
    const {
        handleCreateOrUpdateCampaign,
        isCreateCampaignRequestInProgress,
        campaignStatuses,
        isCreateCampaignModalOpen,
        setIsCreateCampaignModalOpen,
        setCampaignName,
    } = useCampaignInvitation();

    const initiateCampaign = () => {
        setIsCreateCampaignModalOpen(true);
    };

    const handleOnSave = useCallback(() => {
        handleCreateOrUpdateCampaign({
            campaign_Status: campaignStatuses.DRAFT,
            redirectTo: "/marketing/campaign-details",
            isUpdate: false,
        });
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
                        onTextChange={(value) => setCampaignName(value)}
                    />
                )}
            </WithLoader>
        </Box>
    );
};

export default CampaignSubHeader;
