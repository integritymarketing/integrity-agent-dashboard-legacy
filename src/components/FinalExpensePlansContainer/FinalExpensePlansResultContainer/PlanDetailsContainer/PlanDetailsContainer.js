import React, { useEffect, useState } from "react";
import Media from "react-media";
import { useParams } from "react-router-dom";

import PropTypes from "prop-types";
import { useFinalExpensePlans } from "providers/FinalExpense";

import { formatDate, getAgeFromBirthDate } from "utils/dates";
import { scrollTop } from "utils/shared-utils/sharedUtility";

import {
    COVERAGE_AMOUNT,
    COVERAGE_TYPE,
} from "components/FinalExpensePlansContainer/FinalExpensePlansContainer.constants";
import { STEPPER_FILTER } from "components/FinalExpensePlansContainer/FinalexpensePlanOptioncard/FinalexpensePlanOptioncard.constants";
import { BackToTop } from "components/ui/BackToTop";
import Pagination from "components/ui/Pagination/pagination";
import WithLoader from "components/ui/WithLoader";

import useContactDetails from "pages/ContactDetails/useContactDetails";

import { PlanCard } from "./PlanCard";
import styles from "./PlanDetailsContainer.module.scss";

import PersonalisedQuoteBox from "../PersonalisedQuoteBox/PersonalisedQuoteBox";

export const PlanDetailsContainer = ({ coverageType, coverageAmount, monthlyPremium }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [pagedResults, setPagedResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const { contactId } = useParams();
    const [finalExpensePlans, setFinalExpensePlans] = useState([]);
    const { getFinalExpenseQuotePlans } = useFinalExpensePlans();
    const [isLoadingFinalExpensePlans, setIsLoadingFinalExpensePlans] = useState(false);
    const { leadDetails } = useContactDetails(contactId);
    const pageSize = 10;

    useEffect(() => {
        const pagedStart = (currentPage - 1) * pageSize;
        const pageLimit = pageSize * currentPage;
        const slicedResults = [...finalExpensePlans]?.slice(pagedStart, pageLimit);
        setPagedResults(slicedResults);
        scrollTop();
    }, [finalExpensePlans, currentPage, pageSize]);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const { addresses, birthdate, gender, weight, height, isTobaccoUser } = leadDetails;
                if (!addresses?.[0]?.stateCode || !birthdate) return;
                setIsLoadingFinalExpensePlans(true);
                const covType = Array.isArray(coverageType) ? coverageType : [coverageType];
                const age = getAgeFromBirthDate(birthdate);
                const todayDate = formatDate(new Date(), "yyyy-MM-dd");
                const quotePlansPostBody = {
                    usState: addresses[0].stateCode,
                    age: Number(age),
                    gender: gender === "Male" ? "M" : "F",
                    tobacco: Boolean(isTobaccoUser),
                    desiredFaceValue: Number(coverageAmount) || STEPPER_FILTER[COVERAGE_AMOUNT].min,
                    desiredMonthlyRate: null,
                    coverageTypes: covType || [COVERAGE_TYPE[0].value],
                    effectiveDate: todayDate,
                    underWriting: {
                        user: { height: height || 0, weight: weight || 0 },
                        conditions: [{ categoryId: 0, lastTreatmentDate: todayDate }],
                    },
                };

                const result = await getFinalExpenseQuotePlans(quotePlansPostBody);
                setIsLoadingFinalExpensePlans(false);
                setFinalExpensePlans(result?.eligibleSorted || []);
            } catch (error) {
                console.error("Error fetching plans:", error);
            }
        };

        fetchPlans();
    }, [leadDetails, coverageType, coverageAmount, monthlyPremium, getFinalExpenseQuotePlans]);

    return (
        <WithLoader isLoading={isLoadingFinalExpensePlans}>
            <Media
                query={"(max-width: 1130px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <div className={styles.planContainer}>
                <PersonalisedQuoteBox />
                {pagedResults.map((plan, index) => {
                    const {
                        carrier: { name, logoUrl },
                        product: { type },
                        faceValue,
                        modalRates,
                        policyFee,
                    } = plan;
                    const monthlyRate = modalRates.find((rate) => rate.type === "month")?.rate || 0;
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
                <BackToTop />
                <Pagination
                    currentPage={currentPage}
                    resultName="plans"
                    totalPages={Math.ceil(finalExpensePlans.length / 10)}
                    totalResults={finalExpensePlans.length}
                    pageSize={pageSize}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </WithLoader>
    );
};

PlanDetailsContainer.propTypes = {
    coverageType: PropTypes.string.isRequired,
    coverageAmount: PropTypes.string.isRequired,
    monthlyPremium: PropTypes.string.isRequired,
};
