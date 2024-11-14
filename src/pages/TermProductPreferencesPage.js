import { Helmet } from "react-helmet-async";

import Box from "@mui/material/Box";
import { styled } from "@mui/system";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import { TermProductPreferenceForm } from "components/LifeForms";

const StyledBox = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#f1f1f1",
}));

const TermProductPreferencesPage = () => {
    return (
        <>
            <Helmet>
                <title>Integrity - Term Product Preference</title>
            </Helmet>
            <GlobalNav />
            <StyledBox>
                <TermProductPreferenceForm />
            </StyledBox>
            <GlobalFooter />
        </>
    );
};

export default TermProductPreferencesPage;
