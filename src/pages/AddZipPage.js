import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import GlobalNav from "partials/global-nav-v2";
import Footer from "components/Footer";
import WebChatComponent from "components/WebChat/WebChat";

import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import { useParams } from "react-router-dom";
import Media from "react-media";
import { AddZipContainer } from "components/AddZipContainer";
import { HEALTH_POLICIES } from "components/AddZipContainer/AddZipContainer.constants";
import { PageHeader } from "components/PageHeader";

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
                <title>MedicareCENTER - Add Zip </title>
            </Helmet>
            <GlobalNav />
            <PageHeader isMobile={isMobile} contactId={contactId} pageName={HEALTH_POLICIES} />
            <StyledBox>
                <AddZipContainer isMobile={isMobile} contactId={contactId} />
            </StyledBox>
            <WebChatComponent />
            <Footer />
        </>
    );
};

export default AddZipPage;
