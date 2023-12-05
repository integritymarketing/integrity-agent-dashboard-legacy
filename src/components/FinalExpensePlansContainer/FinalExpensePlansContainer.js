import { useEffect, useMemo } from "react";
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

const QUOTE_ID = "390e04ef-be95-463d-9b76-46050cbf438c";

export const FinalExpensePlansContainer = () => {
    const { getFinalExpensePlans, finalExpensePlans, isLoadingFinalExpensePlans, getFinalExpenseQuotePlans } =
        useFinalExpensePlans();

    const { contactId } = useParams();
    const { getLeadDetails, leadDetails, isLoading: isLoadingContactDetails } = useContactDetails(contactId);
    const { birthdate, gender, weight, height, isTobaccoUser, addresses } = leadDetails;

    const { Put: updateLeadData } = useFetch(`${UPDATE_LEAD_DETAILS}${contactId}`);

    useEffect(() => {
        getFinalExpensePlans(QUOTE_ID);
        getLeadDetails();
    }, [getFinalExpensePlans, getLeadDetails]);

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
        const todayDate = formatDate(new Date(), "yyyy-MM-dd");
        const quotePlansPostBody = {
            usState: formData.stateCode,
            age: getAgeFromBirthDate(formData.birthdate),
            gender: gender === "Male" ? "M" : "F",
            tobacco: formData.isTobaccoUser,
            desiredFaceValue: 15000,
            desiredMonthlyRate: 30,
            coverageTypes: ["LEVEL"],
            effectiveDate: todayDate,
            underWriting: {
                user: {
                    height: formData.height,
                    weight: formData.weight,
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
    );
};
