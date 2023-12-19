import { Helmet } from "react-helmet-async";

import FinalExpensePlansResultContainer from "components/FinalExpensePlansContainer/FinalExpensePlansResultContainer";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";

const FinalExpensePlansPage = () => {
    return (
        <>
            <Helmet>
                <title>MedicareCENTER - Final Expenses Plans</title>
            </Helmet>
            <GlobalNav />
            <FinalExpensePlansResultContainer />
            <GlobalFooter />
        </>
    );
};

export default FinalExpensePlansPage;
