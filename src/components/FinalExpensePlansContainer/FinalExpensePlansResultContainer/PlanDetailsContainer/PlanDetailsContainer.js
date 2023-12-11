import React, { useEffect, useState } from "react";
import Media from "react-media";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import styles from "./PlanDetailsContainer.module.scss";
import PersonalisedQuoteBox from "../PersonalisedQuoteBox/PersonalisedQuoteBox";
import { useFinalExpensePlans } from 'providers/FinalExpense';
import useContactDetails from 'pages/ContactDetails/useContactDetails';
import { formatDate, getAgeFromBirthDate } from 'utils/dates';
import { PlanCard } from './PlanCard';
import { COVERAGE_AMOUNT, COVERAGE_TYPE } from "components/FinalExpensePlansContainer/FinalExpensePlansContainer.constants";
import { STEPPER_FILTER } from "components/FinalExpensePlansContainer/FinalexpensePlanOptioncard/FinalexpensePlanOptioncard.constants";

export const PlanDetailsContainer = ({
    coverageType,
    coverageAmount,
    monthlyPremium,
}) => {
    const [isMobile, setIsMobile] = useState(false);
    const { contactId } = useParams();
    const [finalExpensePlans, setFinalExpensePlans] = useState([]);
    const { getFinalExpenseQuotePlans } = useFinalExpensePlans();
    const { leadDetails } = useContactDetails(contactId);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const { addresses, birthdate, gender, weight, height, isTobaccoUser } = leadDetails;
                if (!addresses?.[0]?.stateCode || !birthdate) return;
                const covType = Array.isArray(coverageType) ? coverageType.join() : coverageType;
                const age = getAgeFromBirthDate(birthdate);
                const todayDate = formatDate(new Date(), "yyyy-MM-dd");
                const quotePlansPostBody = {
                    usState: addresses[0].stateCode,
                    age: Number(age),
                    gender: gender === "Male" ? "M" : "F",
                    tobacco: Boolean(isTobaccoUser),
                    desiredFaceValue: Number(coverageAmount) || STEPPER_FILTER[COVERAGE_AMOUNT].min,
                    desiredMonthlyRate: null,
                    coverageTypes: [covType || COVERAGE_TYPE[0].value],
                    effectiveDate: todayDate,
                    underWriting: {
                        user: { height, weight },
                        conditions: [{ categoryId: 65, lastTreatmentDate: todayDate }],
                    },
                };

                const result = await getFinalExpenseQuotePlans(quotePlansPostBody);
                setFinalExpensePlans(result?.eligibleSorted || []);
            } catch (error) {
                console.error('Error fetching plans:', error);
            }
        };

        fetchPlans();
    }, [leadDetails, coverageType, coverageAmount, monthlyPremium, getFinalExpenseQuotePlans]);

    return (
        <>
            <Media
                query={"(max-width: 1130px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <div className={styles.planContainer}>
                <PersonalisedQuoteBox />
                {finalExpensePlans.map((plan, index) => {
                    const { carrier: { name, logoUrl }, product: { type }, faceValue, modalRates, policyFee } = plan;
                    const monthlyRate = modalRates.find(rate => rate.type === "month")?.rate || 0;
                    return (
                        <PlanCard
                            key={`${name}-${index}`}
                            isMobile={isMobile}
                            planName={name}
                            logoUrl={logoUrl}
                            coverageType={type}
                            coverageAmount={faceValue}
                            monthlyPremium={monthlyRate}
                            policyFee={policyFee}
                        />
                    );
                })}
            </div>
        </>
    );
};

PlanDetailsContainer.propTypes = {
    coverageType: PropTypes.string.isRequired,
    coverageAmount: PropTypes.string.isRequired,
    monthlyPremium: PropTypes.string.isRequired,
};