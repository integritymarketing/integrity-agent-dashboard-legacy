import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { useFinalExpensePlans } from "providers/FinalExpense";

import { formatDate, getAgeFromBirthDate } from "utils/dates";

import useFetch from "hooks/useFetch";

import { UPDATE_LEAD_DETAILS } from "components/AddZipContainer/AddZipContainer.constants";
import PlanCardLoader from "components/ui/PlanCard/loader";

import useContactDetails from "pages/ContactDetails/useContactDetails";

import FinalExpenseContactBar from "./FinalExpenseContactBar";
import FinalExpenseContactDetailsForm from "./FinalExpenseContactDetailsForm";
import { FinalExpensePlanCard } from "./FinalExpensePlanCard";
import FinalExpensePlansResultContainer from "./FinalExpensePlansResultContainer";
import {
    COVERAGE_AMOUNT,
    COVERAGE_TYPE,
    MONTHLY_PREMIUM,
    STEPPER_FILTER,
} from "./FinalExpensePlansResultContainer/FinalExpensePlansResultContainer.constants";

const QUOTE_ID = "390e04ef-be95-463d-9b76-46050cbf438c";

export const FinalExpensePlansContainer = () => {
    const { getFinalExpensePlans, finalExpensePlans, isLoadingFinalExpensePlans, getFinalExpenseQuotePlans } =
        useFinalExpensePlans();

    const { contactId } = useParams();
    const contactFormDataRef = useRef(null);
    const [submittedContactDetails, setSubmittedContactDetails] = useState(false);
    const { getLeadDetails, leadDetails, isLoading: isLoadingContactDetails } = useContactDetails(contactId);
    const { birthdate, gender, weight, height, isTobaccoUser, addresses } = leadDetails;

    const { Put: updateLeadData } = useFetch(`${UPDATE_LEAD_DETAILS}${contactId}`);

    const [coverageAmount, setCoverageAmount] = useState(STEPPER_FILTER[COVERAGE_AMOUNT].min);
    const [monthlyPremiumAmount, setMonthlyPremiumAmount] = useState(STEPPER_FILTER[MONTHLY_PREMIUM].min);
    const [coverageType, setCoverageType] = useState(COVERAGE_TYPE[0].value);

    useEffect(() => {
        getFinalExpensePlans(QUOTE_ID);
        getLeadDetails();
    }, [getFinalExpensePlans, getLeadDetails]);

    const fetchPlansData = async () => {
        const todayDate = formatDate(new Date(), "yyyy-MM-dd");
        const quotePlansPostBody = {
            usState: contactFormDataRef.current.stateCode,
            age: getAgeFromBirthDate(contactFormDataRef.current.birthdate),
            gender: contactFormDataRef.current.gender === "Male" ? "M" : "F",
            tobacco: Boolean(contactFormDataRef.current.isTobaccoUser),
            desiredFaceValue: coverageAmount,
            desiredMonthlyRate: monthlyPremiumAmount,
            coverageTypes: [coverageType],
            effectiveDate: todayDate,
            underWriting: {
                user: {
                    height: contactFormDataRef.current.height,
                    weight: contactFormDataRef.current.weight,
                },
                conditions: [
                    {
                        categoryId: 0,
                        lastTreatmentDate: todayDate,
                    },
                ],
            },
        };
        const result = await getFinalExpenseQuotePlans(quotePlansPostBody);
    };

    const onSave = async (formData) => {
        const leadDetailsNew = { ...leadDetails };
        const address = { ...leadDetailsNew.addresses[0] };
        if (address.stateCode !== formData.stateCode) {
            address.stateCode = formData.stateCode;
            address.postalCode = "";
            address.city = "";
            address.county = "";
            address.countyFips = "";
        }
        await updateLeadData({
            ...leadDetailsNew,
            addresses: [address],
            ...formData,
        });
        await getLeadDetails();
        contactFormDataRef.current = { ...formData };
        setSubmittedContactDetails(true);
    };

    useEffect(() => {
        if (submittedContactDetails && contactFormDataRef.current) {
            fetchPlansData();
        }
    }, [submittedContactDetails, coverageAmount, monthlyPremiumAmount, coverageType]);

    const renderPlanCardLoaders = useMemo(() => {
        const loaders = Array.from({ length: 10 }, (_, i) => <PlanCardLoader key={i} />);
        return loaders;
    }, []);

    const renderContactDetailsLoader = useMemo(() => <PlanCardLoader />, []);

    const renderPlanCards = useMemo(
        () =>
            finalExpensePlans?.map(
                ({
                    Company,
                    Rates,
                    CompensationWarning,
                    PolicyFee,
                    IsSocialSecurityBillingSupported,
                    PlanInfo,
                    UnderwritingWarning,
                }) => (
                    <FinalExpensePlanCard
                        key={PlanInfo}
                        company={Company}
                        rates={Rates}
                        compensationWarning={CompensationWarning}
                        policyFee={PolicyFee}
                        isSocialSecurityBillingSupported={IsSocialSecurityBillingSupported}
                        planInfo={PlanInfo}
                        underwritingWarning={UnderwritingWarning}
                    />
                )
            ),
        [finalExpensePlans]
    );

    return (
        <>
            {!submittedContactDetails && (
                <>
                    <FinalExpenseContactBar />
                    {isLoadingContactDetails ? (
                        renderContactDetailsLoader
                    ) : (
                        <FinalExpenseContactDetailsForm
                            birthdate={birthdate}
                            sexuality={gender}
                            address={addresses[0]}
                            wt={weight}
                            hFeet={height ? Math.floor(height / 12) : ""}
                            hInch={height ? height % 12 : ""}
                            smoker={isTobaccoUser}
                            onSave={onSave}
                        />
                    )}
                </>
            )}
            {submittedContactDetails && (
                <FinalExpensePlansResultContainer
                    contactId={contactId}
                    coverageAmount={coverageAmount}
                    monthlyPremiumAmount={monthlyPremiumAmount}
                    coverageType={coverageType}
                    setCoverageAmount={setCoverageAmount}
                    setMonthlyPremiumAmount={setMonthlyPremiumAmount}
                    setCoverageType={setCoverageType}
                />
            )}
        </>
    );
};
