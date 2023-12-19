import { Helmet } from "react-helmet-async";
import GlobalNav from "partials/global-nav-v2";
import GlobalFooter from "partials/global-footer";
import FinalExpensePlansResultContainer from "components/FinalExpensePlansContainer/FinalExpensePlansResultContainer";

const FinalExpensePlansPage = () => {
    return (
        <>
            <Helmet>
                <title>Integrity Clients - Final Expenses Plans</title>
            </Helmet>
            <GlobalNav />
            <FinalExpensePlansResultContainer />
            <GlobalFooter />
        </>
    );
};

export default FinalExpensePlansPage;
