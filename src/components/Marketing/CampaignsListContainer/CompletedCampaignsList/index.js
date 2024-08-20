import React from "react";
import { Grid } from "@mui/material";
import CampaignDetailsCard from "../CampaignDetailsCard";
import { useMarketing } from "providers/Marketing";

const CompletedCampaignsList = () => {
    const { completedCampaignsList = [] } = useMarketing();

    return (
        <Grid container spacing={3} marginTop={"16px"}>
            {completedCampaignsList?.map((campaign, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <CampaignDetailsCard
                        title={"PlanEnroll Invite"}
                        status={campaign?.leads?.length}
                        date={campaign?.campaignRunDate}
                        type={campaign?.campaignChannel}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default CompletedCampaignsList;
