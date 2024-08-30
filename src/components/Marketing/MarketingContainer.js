import React, { useEffect } from "react";
import MarketingInfo from "./MarketingInfo";
import CampaignsListContainer from "./CampaignsListContainer/CampaignsListContainer";
import { useMarketing } from "providers/Marketing";
import styles from "./MarketingContainer.module.scss";
import WithLoader from "components/ui/WithLoader";
import SubHeader from "components/SubHeader";

export default function MarketingContainer() {
    const { getCompletedCampaigns, isFetchCompletedCampaignsLoading } = useMarketing();

    useEffect(() => {
        getCompletedCampaigns();
    }, [getCompletedCampaigns]);

    return (
        <div className={styles.container}>
            <SubHeader title="Client Connect Marketing" showBackButton={true} />
            <div className={styles.innerContainer}>
                <MarketingInfo />
                <WithLoader isLoading={isFetchCompletedCampaignsLoading}>
                    <CampaignsListContainer />
                </WithLoader>
            </div>
        </div>
    );
}
