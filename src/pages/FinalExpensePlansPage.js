import React from "react";
import { Helmet } from "react-helmet-async";
import GlobalNav from "partials/global-nav-v2";
import GlobalFooter from "partials/global-footer";
import { FinalExpensePlansProvider } from "providers/FinalExpense";

const FinalExpensePlansPage = () => {
  return (
    <>
      <Helmet>
        <title>MedicareCENTER - Final Expenses Plans</title>
      </Helmet>
      <FinalExpensePlansProvider>
        <GlobalNav />
        <div>
          <h2>Final Expenses Plans</h2>
        </div>
        <GlobalFooter />
      </FinalExpensePlansProvider>
    </>
  );
};

export default FinalExpensePlansPage;
