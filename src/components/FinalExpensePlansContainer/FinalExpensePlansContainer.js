import { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import useFetch from "hooks/useFetch";

import { UPDATE_LEAD_DETAILS } from "components/AddZipContainer/AddZipContainer.constants";
import PlanCardLoader from "components/ui/PlanCard/loader";
import WithLoader from "components/ui/WithLoader";

import useContactDetails from "pages/ContactDetails/useContactDetails";

import FinalExpenseContactBar from "./FinalExpenseContactBar";
import FinalExpenseContactDetailsForm from "./FinalExpenseContactDetailsForm";

export const FinalExpensePlansContainer = () => {
    const { contactId } = useParams();
    const contactFormDataRef = useRef(null);
    const { getLeadDetails, leadDetails, isLoading: isLoadingContactDetails } = useContactDetails(contactId);
    const { Put: updateLeadData } = useFetch(`${UPDATE_LEAD_DETAILS}${contactId}`);
    const navigate = useNavigate();
    const { birthdate, gender, weight, height, isTobaccoUser, addresses } = leadDetails;

    useEffect(() => {
        getLeadDetails();
    }, [getLeadDetails]);

    const onSave = async (formData) => {
        const leadDetailsNew = { ...leadDetails };
        const address = { ...leadDetailsNew.addresses?.[0] };
        const code = JSON.stringify({ stateCode: formData.stateCode });
        sessionStorage.setItem(contactId, code);
        await updateLeadData({
            ...leadDetailsNew,
            addresses: [address],
            ...formData,
        });
        await getLeadDetails();
        contactFormDataRef.current = { ...formData };
        navigate(`/finalexpenses/healthconditions/${contactId}`);
    };

    const renderPlanCardLoaders = useMemo(() => {
        const loaders = Array.from({ length: 10 }, (_, i) => <PlanCardLoader key={i} />);
        return loaders;
    }, []);

    const renderContactDetailsLoader = useMemo(() => <PlanCardLoader />, []);

    return (
        <WithLoader isLoading={isLoadingContactDetails}>
            <FinalExpenseContactBar />
            {isLoadingContactDetails ? (
                renderContactDetailsLoader
            ) : (
                <FinalExpenseContactDetailsForm
                    contactId={contactId}
                    birthdate={birthdate}
                    sexuality={gender}
                    address={addresses?.[0]}
                    wt={weight}
                    hFeet={height ? Math.floor(height / 12) : ""}
                    hInch={height ? height % 12 : ""}
                    smoker={isTobaccoUser}
                    onSave={onSave}
                />
            )}
        </WithLoader>
    );
};
