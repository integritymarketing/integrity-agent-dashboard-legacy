import { Helmet } from "react-helmet-async";
import GlobalNav from "partials/global-nav-v2";
import GlobalFooter from "partials/global-footer";
import FinalExpenseHealthConditionsContainer from "components/FinalExpenseHealthConditionsContainer";

const FinalExpenseHealthConditionsPage = () => {
    return (
        <>
            <Helmet>
                <title>Integrity Clients - Final Expenses Health COnditions</title>
            </Helmet>
            <GlobalNav />
            <FinalExpenseHealthConditionsContainer />
            <GlobalFooter />
        </>
    );
};

export default FinalExpenseHealthConditionsPage;
