import { Helmet } from "react-helmet-async";
import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import { CampaignInvitationContainer } from "components/CampaignInvitationContainer";
import { useCampaignInvitation } from "providers/CampaignInvitation";
import { useEffect } from "react";
import PlanEnrollCampaign from "images/Campaigns/plan-enroll-campaign.JPG";

export default function CampaignInvitation() {
    const { handleTotalContactsCount, handleInvitationName, handleInvitationTemplateImage } = useCampaignInvitation();

    useEffect(() => {
        handleInvitationName("PlanEnroll");
        handleInvitationTemplateImage(PlanEnrollCampaign);
        handleTotalContactsCount(1302);
    }, []);

    return (
        <>
            <Helmet>
                <title>Campaign Invitation Page</title>
            </Helmet>
            <GlobalNav />
            <CampaignInvitationContainer />
            <GlobalFooter />
        </>
    );
}
