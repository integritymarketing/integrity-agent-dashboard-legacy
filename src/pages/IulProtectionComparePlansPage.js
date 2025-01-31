import { Helmet } from "react-helmet-async";
import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import IulProtectionComparePlans from "components/LifeIulQuote/IulProtectionComparePlans";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";

const StyledBox = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#f1f1f1",
}));

const IulProtectionComparePlansPage = () => {
    return (
        <>
            <Helmet>
                <title>Integrity - IUL Protection Compare Plans Page</title>
            </Helmet>
            <GlobalNav />
            <StyledBox>
                <IulProtectionComparePlans />
            </StyledBox>
            <GlobalFooter />
        </>
    );
};

export default IulProtectionComparePlansPage;