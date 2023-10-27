import React from "react";
import { styled } from "@mui/system";
import Box from "@mui/material/Box";
import { Helmet } from "react-helmet-async";
import GlobalNav from "partials/global-nav-v2";
import GlobalFooter from "partials/global-footer";
import { FinalExpensePlansProvider } from "providers/FinalExpense";
import { FinalExpensePlansContainer } from "components/FinalExpensePlansContainer";

const StyledBox = styled(Box)(() => ({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: "#f1f1f1",
}));

const FinalExpensePlansPage = () => {
  return (
    <>
      <Helmet>
        <title>MedicareCENTER - Final Expenses Plans</title>
      </Helmet>
      <FinalExpensePlansProvider>
        <GlobalNav />
        <StyledBox>
          <FinalExpensePlansContainer />
        </StyledBox>
        <GlobalFooter />
      </FinalExpensePlansProvider>
    </>
  );
};

export default FinalExpensePlansPage;
