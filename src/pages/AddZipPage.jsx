import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Media from "react-media";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import { styled } from "@mui/system";

import { AddZipContainer } from "components/AddZipContainer";
import { HEALTH_POLICIES } from "components/AddZipContainer/AddZipContainer.constants";
import { PageHeader } from "components/PageHeader";
import WebChatComponent from "components/WebChat/WebChat";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import { QUOTE_TYPE_LABEL } from "components/ContactDetailsContainer/OverviewContainer/overviewContainer.constants";

const StyledBox = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#f1f1f1",
}));

const AddZipPage = () => {
    const { contactId } = useParams();
    const [isMobile, setIsMobile] = useState(false);
    return (
        <>
            <Media
                query={"(max-width: 500px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <Helmet>
                <title>Integrity - Add Zip </title>
            </Helmet>
            <GlobalNav showQuoteType={QUOTE_TYPE_LABEL.MEDICARE} />
            {/* <PageHeader isMobile={isMobile} backPath={`/contact/${contactId}/overview`} contactId={contactId} pageName={HEALTH_POLICIES} /> */}
            <StyledBox>
                <AddZipContainer isMobile={isMobile} contactId={contactId} />
            </StyledBox>
            <WebChatComponent />
            <GlobalFooter />
        </>
    );
};

export default AddZipPage;
