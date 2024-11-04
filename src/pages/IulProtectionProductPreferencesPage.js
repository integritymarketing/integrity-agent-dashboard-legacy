import { Helmet } from "react-helmet-async";

import Box from "@mui/material/Box";
import { styled } from "@mui/system";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import { IulProtectionProductPreferenceForm } from "components/LifeForms";

const StyledBox = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#f1f1f1",
}));

const IulProtectionProductPreferencesPage = () => {
    return (
        <>
            <Helmet>
                <title>Integrity - IUL Protection Product Preference</title>
            </Helmet>
            <GlobalNav />
            <StyledBox>
                <IulProtectionProductPreferenceForm />
            </StyledBox>
            <GlobalFooter />
        </>
    );
};

export default IulProtectionProductPreferencesPage;
