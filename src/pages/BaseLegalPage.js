import React from "react";

import Container from "components/ui/container";

import GlobalFooter from "partials/global-footer";
import GlobalNavV2 from "partials/global-nav-v2";
import IntegrityFooter from "partials/integrity-footer";
import IntegrityHeader from "partials/integrity-header";

const BaseLegalPage = ({ children, title, showIntegrity = false, ...props }) => {
    return (
        <div className="content-frame" {...props}>
            <div className="bg-photo text-invert">
                {!showIntegrity && <GlobalNavV2 />}
                {showIntegrity && <IntegrityHeader />}
                <Container id="main-content" className="scaling-header">
                    <h2 className="hdg hdg--2">{title}</h2>
                </Container>
            </div>
            <div className="v2">
                <div className="bg-white padding-2" data-gtm="learning-center-recommended-read-wrapper">
                    <Container className="pt-scale-3 pb-scale-4">{children}</Container>
                </div>
            </div>
            {!showIntegrity && <GlobalFooter />}
            {showIntegrity && <IntegrityFooter />}
        </div>
    );
};

export default BaseLegalPage;
