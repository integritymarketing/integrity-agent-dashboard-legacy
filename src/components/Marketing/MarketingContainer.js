import React, {useEffect, useState} from "react";
import MarketingInfo from "./MarketingInfo";
import CampaignsListContainer from "./CampaignsListContainer/CampaignsListContainer";
import { useMarketing } from "providers/Marketing";
import styles from "./MarketingContainer.module.scss";
import WithLoader from "components/ui/WithLoader";
import SubHeader from "components/SubHeader";
import CreateCampaignModal from "../CampaignInvitationContainer/CreateCampaignModal";
import {useCampaignInvitation} from "../../providers/CampaignInvitation";
import PlusIcon from "../../images/Campaigns/icons-Plus.svg";

export default function MarketingContainer() {
    const { getCompletedCampaigns, isFetchCompletedCampaignsLoading } = useMarketing();

    const {initiateCampaign,
        isCreateCampaignRequestInProgress} = useCampaignInvitation();

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getCompletedCampaigns();
    }, [getCompletedCampaigns]);

    return (
        <div className={styles.container}>
            <SubHeader
                title="Client Connect Marketing"
                showBackButton={true}
                showActionButton={true}
                actionButtonIcon={<img src={PlusIcon} alt="Plus Icon"/>}
                actionButtonText={"New Campaign"}
                onClickActionButton={() => setIsModalOpen(true)}
            />
            <div className={styles.innerContainer}>
                <MarketingInfo />
                <WithLoader isLoading={isFetchCompletedCampaignsLoading}>
                    <CampaignsListContainer />
                </WithLoader>
            </div>
            <WithLoader isLoading={isCreateCampaignRequestInProgress}>
                {isModalOpen && <CreateCampaignModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onSave={initiateCampaign}
                    actionButtonName="Create"
                    cancelButtonName="Cancel"
                />}
            </WithLoader>
        </div>
    );
}
