import React from "react";
import Box from "@mui/material/Box";
import { Helmet } from "react-helmet-async";
import GlobalNav from "partials/global-nav-v2";
import GlobalFooter from "partials/global-footer";
import { FinalExpensePlansProvider } from "providers/FinalExpense";
import { FinalExpenseWithProvider } from "components/FinalExpensePlansContainer";

const FinalExpensePlansPage = () => {
  return (
    <Box
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f1f1f1",
      }}
    >
      <Helmet>
        <title>MedicareCENTER - Final Expenses Plans</title>
      </Helmet>
      <FinalExpensePlansProvider>
        <GlobalNav />
        <div>
          <h2>Final Expenses Plans</h2>
        </div>
        <FinalExpenseWithProvider />

        <GlobalFooter />
      </FinalExpensePlansProvider>
    </Box>
  );
};

export default FinalExpensePlansPage;
