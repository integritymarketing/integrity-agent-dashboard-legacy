import { Helmet } from "react-helmet-async";
import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";

import MarketingContainer from "components/Marketing/MarketingContainer";

export default function CampaignDashboard() {
    return (
        <>
            <Helmet>
                <title>Campaign Dashboard</title>
            </Helmet>
            <MarketingContainer />
        </>
    );
}
