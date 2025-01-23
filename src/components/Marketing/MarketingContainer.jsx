import { useCallback, useEffect, useState } from "react";
import MarketingInfo from "./MarketingInfo";
import CampaignsListContainer from "./CampaignsListContainer/CampaignsListContainer";
import { useMarketing } from "providers/Marketing";
import { useCampaignInvitation } from "providers/CampaignInvitation";
import styles from "./MarketingContainer.module.scss";
import WithLoader from "components/ui/WithLoader";
import SubHeader from "components/SubHeader";
import CreateCampaignModal from "../CampaignInvitationContainer/CreateCampaignModal";
import PlusIcon from "../../images/Campaigns/icons-Plus.svg";

export default function MarketingContainer() {
    const { getCompletedCampaigns, isFetchCompletedCampaignsLoading } = useMarketing();
    const {
        reset,
        handleCreateOrUpdateCampaign,
        isCreateCampaignRequestInProgress,
        campaignStatuses,
        setCampaignName,
    } = useCampaignInvitation();

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getCompletedCampaigns();
    }, [getCompletedCampaigns]);

    const handleOnSave = useCallback(() => {
        handleCreateOrUpdateCampaign({
            campaign_Status: campaignStatuses.DRAFT,
            redirectTo: "/marketing/campaign-details",
            isUpdate: false,
        });
    }, [handleCreateOrUpdateCampaign, campaignStatuses]);

    const initiateCampaign = () => {
        reset();
        setIsModalOpen(true);
    };

    return (
        <div className={styles.container}>
            <SubHeader
                title="Client Connect Marketing"
                showBackButton={true}
                showActionButton={true}
                actionButtonIcon={<img src={PlusIcon} alt="Plus Icon" />}
                actionButtonText="New Campaign"
                onClickActionButton={initiateCampaign}
            />
            <div className={styles.innerContainer}>
                <MarketingInfo />
                <WithLoader isLoading={isFetchCompletedCampaignsLoading}>
                    <CampaignsListContainer />
                </WithLoader>
            </div>
            <WithLoader isLoading={isCreateCampaignRequestInProgress}>
                {isModalOpen && (
                    <CreateCampaignModal
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        onSave={handleOnSave}
                        actionButtonName="Create"
                        cancelButtonName="Cancel"
                        onTextChange={(value) => setCampaignName(value)}
                    />
                )}
            </WithLoader>
        </div>
    );
}
