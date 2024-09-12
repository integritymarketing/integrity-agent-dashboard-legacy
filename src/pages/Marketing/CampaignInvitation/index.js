import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import { CampaignInvitationContainer } from "components/CampaignInvitationContainer";
import { useCampaignInvitation } from "providers/CampaignInvitation";

export default function CampaignInvitation() {
    const navigate = useNavigate();
    const { campaignDescription } = useCampaignInvitation();

    useEffect(() => {
        if (campaignDescription === "") {
            navigate("/marketing/campaign-dashboard");
        }
    }, [campaignDescription, navigate]);

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
