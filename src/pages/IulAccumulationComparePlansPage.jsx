import { Helmet } from "react-helmet-async";
import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import IulAccumulationComparePlans from "components/LifeIulQuote/IulAccumulationComparePlans";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";

const StyledBox = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#f1f1f1",
}));

const IulAccumulationComparePlansPage = () => {
    return (
        <>
            <Helmet>
                <title>Integrity - IUL Accumulation Compare Plans Page</title>
            </Helmet>
            <GlobalNav />
            <StyledBox>
                <IulAccumulationComparePlans />
            </StyledBox>
            <GlobalFooter />
        </>
    );
};

export default IulAccumulationComparePlansPage;