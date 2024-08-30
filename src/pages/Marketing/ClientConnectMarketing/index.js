import { Helmet } from "react-helmet-async";
import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";

import { ClientConnectMarketingContainer } from "components/ClientConnectMarketing/ClientConnectMarketingContainer";

export default function ClientConnectMarketing() {
    return (
        <>
            <Helmet>
                <title>Client Connect Marketing</title>
            </Helmet>
            <GlobalNav />
            <ClientConnectMarketingContainer />
            <GlobalFooter />
        </>
    );
}
