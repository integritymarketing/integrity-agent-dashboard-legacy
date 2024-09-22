import { Helmet } from "react-helmet-async";
import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import { CampaignInvitationContainer } from "components/CampaignInvitationContainer";

export default function CampaignInvitation() {
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
