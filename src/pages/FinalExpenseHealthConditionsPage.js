import { Helmet } from "react-helmet-async";

import FinalExpenseHealthConditionsContainer from "components/FinalExpenseHealthConditionsContainer";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";

const FinalExpenseHealthConditionsPage = () => {
    return (
        <>
            <Helmet>
                <title>Integrity - Final Expenses Health Conditions</title>
            </Helmet>
            <GlobalNav />
            <FinalExpenseHealthConditionsContainer />
            <GlobalFooter />
        </>
    );
};

export default FinalExpenseHealthConditionsPage;
