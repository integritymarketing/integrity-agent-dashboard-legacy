import { useCallback, useEffect, useMemo, useState } from "react";
import Media from "react-media";
import { useParams } from "react-router-dom";

import { Text } from "@integritymarketing/ui-text-components";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import useFetch from "hooks/useFetch";
import usePreferences from "hooks/usePreferences";

import Heading4 from "packages/Heading4";

import { ContactProfileTabBar } from "components/ContactDetailsContainer";
import { CurrencyAdjuster } from "components/CurrencyAdjuster";
import {
    AGENT_SERVICE_NON_RTS,
    COVERAGE_AMOUNT,
    MONTHLY_PREMIUM,
    SIMPLIFIED_IUL_TITLE,
} from "components/FinalExpensePlansContainer/FinalExpensePlansContainer.constants";
import CheckedIcon from "components/icons/CheckedIcon";
import UnCheckedIcon from "components/icons/unChecked";
import { Select } from "components/ui/Select";

import {
    COVERAGE_AMT_VALIDATION,
    COVERAGE_AMT_VALIDATION_SIMPLIFIED_IUL,
    COVERAGE_TYPE,
    COVERAGE_TYPE_HEADING,
    DEFAULT_COVERAGE_AMOUNT,
    DEFAULT_COVERAGE_AMOUNT_SIMPLIFIED_IUL,
    DEFAULT_MONTHLY_PREMIUM,
    DEFAULT_MONTHLY_PREMIUM_SIMPLIFIED_IUL,
    EXCLUDE_LABEL,
    MONTHLY_PREMIUM_VALIDATION,
    MONTHLY_PREMIUM_VALIDATION_SIMPLIFIED_IUL,
    MY_APPOINTED_LABEL,
    PLAN_OPTIONS_HEADING,
    STEPPER_FILTER,
    STEPPER_FILTER_SIMPLIFIED_IUL,
} from "./FinalExpensePlansResultContainer.constants";
import styles from "./FinalExpensePlansResultContainer.module.scss";
import { PlanDetailsContainer } from "./PlanDetailsContainer/PlanDetailsContainer";
import { useCreateNewQuote } from "../../../providers/CreateNewQuote";
import Typography from "@mui/material/Typography";

const FinalExpensePlansResultContainer = () => {
    const [isMobile, setIsMobile] = useState(false);
    const { contactId } = useParams();

    const [isRTS, setIsRTS] = useState();

    const { agentInformation } = useAgentInformationByID();
    const { isSimplifiedIUL } = useCreateNewQuote();

    const agentNPN = agentInformation?.agentNPN;

    const { Get: getAgentNonRTS, loading: getAgentNonRTSLoading } = useFetch(`${AGENT_SERVICE_NON_RTS}${agentNPN}`);

    const [selectedTab, setSelectedTab] = useState(COVERAGE_AMOUNT);

    const stepperFilter = useMemo(() => {
        return isSimplifiedIUL() ? STEPPER_FILTER_SIMPLIFIED_IUL : STEPPER_FILTER;
    }, [isSimplifiedIUL]);

    const { min: covMin, max: covMax, step: covStep } = stepperFilter[COVERAGE_AMOUNT];
    const { min, max, step } = stepperFilter[MONTHLY_PREMIUM];

    const defaultIsMyAppointedProducts = useMemo(
        () => ({
            contactId: contactId || null,
            preferenceFlag: false,
        }),
        [contactId],
    );

    const defaultCoverageAmount = useMemo(() => {
        return isSimplifiedIUL() ? DEFAULT_COVERAGE_AMOUNT_SIMPLIFIED_IUL : DEFAULT_COVERAGE_AMOUNT;
    }, [isSimplifiedIUL]);

    const defaultMonthlyPremium = useMemo(() => {
        return isSimplifiedIUL() ? DEFAULT_MONTHLY_PREMIUM_SIMPLIFIED_IUL : DEFAULT_MONTHLY_PREMIUM;
    }, [isSimplifiedIUL]);

    const [coverageAmount, setCoverageAmount] = usePreferences(defaultCoverageAmount, "coverage");
    const [monthlyPremiumAmount, setMonthlyPremiumAmount] = usePreferences(defaultMonthlyPremium, "monthlyPremium");
    const [coverageType, setCoverageType] = usePreferences(COVERAGE_TYPE[4].value, "sessionCoverageType");
    const [isMyAppointedProducts, setIsMyAppointedProducts] = usePreferences(
        defaultIsMyAppointedProducts,
        "sessionIsMyAppointedProducts",
    );
    const [appointmentSession, setAppointmentSession] = usePreferences(false, "appointmentSession");
    const [isShowExcludedProducts, setIsShowExcludedProducts] = usePreferences(false, "sessionIsShowExcludedProducts");
    const [sessionLead, setSessionLead] = usePreferences(null, "sessionLead");

    useEffect(() => {
        const handleFinalExpensePlanClick = async () => {
            const isAgentNonRTS = await getAgentNonRTS();
            if (isAgentNonRTS === "True") {
                setIsMyAppointedProducts(false);
            } else {
                if (!appointmentSession) {
                    setIsRTS(true);
                } else {
                    setIsRTS(false);
                }
            }
        };
        if (agentNPN) {
            handleFinalExpensePlanClick();
        }
    }, [agentNPN]);

    useEffect(() => {
        if (contactId !== sessionLead) {
            setSessionLead(contactId);
            resetToDefaultPreferences();
        }
    }, [contactId, sessionLead, setSessionLead]);

    useEffect(() => {
        setCoverageAmount(isSimplifiedIUL() ? DEFAULT_COVERAGE_AMOUNT_SIMPLIFIED_IUL : DEFAULT_COVERAGE_AMOUNT);
    }, [isSimplifiedIUL]);

    const resetToDefaultPreferences = () => {
        setCoverageAmount(defaultCoverageAmount);
        setMonthlyPremiumAmount(defaultMonthlyPremium);
        setCoverageType(COVERAGE_TYPE[4].value);
        setIsMyAppointedProducts(defaultIsMyAppointedProducts);
        setIsShowExcludedProducts(false);
        setAppointmentSession(false);
    };

    const updateCoverageAmount = (value) => {
        setCoverageAmount(value);
    };

    const updateMonthlyPremiumAmount = (value) => {
        setMonthlyPremiumAmount(value);
    };

    const increment = () => {
        if (selectedTab === COVERAGE_AMOUNT) {
            if (coverageAmount + covStep <= covMax) {
                updateCoverageAmount(coverageAmount + covStep);
            } else {
                setCoverageAmount(covMax);
            }
        } else {
            if (monthlyPremiumAmount + step <= max) {
                updateMonthlyPremiumAmount(monthlyPremiumAmount + step);
            } else {
                setMonthlyPremiumAmount(max);
            }
        }
    };

    const decrement = () => {
        if (selectedTab === COVERAGE_AMOUNT) {
            if (coverageAmount - covStep >= covMin) {
                updateCoverageAmount(coverageAmount - covStep);
            } else {
                setCoverageAmount(covMin);
            }
        } else {
            if (monthlyPremiumAmount - step >= min) {
                updateMonthlyPremiumAmount(monthlyPremiumAmount - step);
            } else {
                setMonthlyPremiumAmount(min);
            }
        }
    };

    const handleCoverageTypeChange = (value) => {
        setCoverageType(value);
    };

    const handleInputChange = (e) => {
        const value = Number(e.target.value.replace(/[^0-9]/g, "")) || 0;
        if (selectedTab === COVERAGE_AMOUNT) {
            updateCoverageAmount(value);
        } else {
            updateMonthlyPremiumAmount(value);
        }
    };

    const handleTabSelect = (tab) => {
        setSelectedTab(tab);
    };

    const handleMyAppointedProductsCheck = useCallback(() => {
        if (!isRTS) {
            return;
        }
        setIsMyAppointedProducts(!isMyAppointedProducts);
    }, [isRTS, isMyAppointedProducts]);

    const handleIsShowExcludedProductsCheck = useCallback(() => {
        setIsShowExcludedProducts(!isShowExcludedProducts);
    }, [isShowExcludedProducts]);

    const covAmtError = useMemo(() => {
        return coverageAmount < covMin || coverageAmount > covMax;
    }, [coverageAmount, covMin, covMax]);

    const monthlyPremError = useMemo(() => {
        return monthlyPremiumAmount < min || monthlyPremiumAmount > max;
    }, [monthlyPremiumAmount, min, max]);

    return (
        <>
            <Media
                query={"(max-width: 800px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <ContactProfileTabBar contactId={contactId} showTabs={false} />
            {isSimplifiedIUL() && (
                <div className={styles.pageHeading}>
                    <Typography variant="h2" color="#052A63">
                        {SIMPLIFIED_IUL_TITLE}
                    </Typography>
                </div>
            )}
            <div className={`${styles.contentWrapper} ${isMobile ? styles.column : ""}`}>
                <div className={styles.filterContent}>
                    <CurrencyAdjuster
                        stepperValue={selectedTab === COVERAGE_AMOUNT ? coverageAmount : monthlyPremiumAmount}
                        selectedTab={selectedTab}
                        setSelectedTab={handleTabSelect}
                        disableMin={
                            selectedTab === COVERAGE_AMOUNT ? coverageAmount <= covMin : monthlyPremiumAmount <= min
                        }
                        disableMax={
                            selectedTab === COVERAGE_AMOUNT ? coverageAmount >= covMax : monthlyPremiumAmount >= max
                        }
                        increment={increment}
                        decrement={decrement}
                        onChange={handleInputChange}
                        inputErrorStyle={
                            (covAmtError && selectedTab === COVERAGE_AMOUNT) ||
                            (monthlyPremError && selectedTab === MONTHLY_PREMIUM)
                                ? styles.inputError
                                : ""
                        }
                    />
                    {selectedTab === COVERAGE_AMOUNT && covAmtError && (
                        <div className={styles.error}>
                            {isSimplifiedIUL() ? COVERAGE_AMT_VALIDATION_SIMPLIFIED_IUL : COVERAGE_AMT_VALIDATION}
                        </div>
                    )}
                    {selectedTab === MONTHLY_PREMIUM && monthlyPremError && (
                        <div className={styles.error}>
                            {isSimplifiedIUL() ? MONTHLY_PREMIUM_VALIDATION_SIMPLIFIED_IUL : MONTHLY_PREMIUM_VALIDATION}
                        </div>
                    )}
                    <div className={styles.planOptionsBox}>
                        <Heading4 className={styles.planOptionsHeader} text={PLAN_OPTIONS_HEADING} />
                        {!isSimplifiedIUL() && <Text className={styles.planOptionsText} text={COVERAGE_TYPE_HEADING} />}
                        {!isSimplifiedIUL() && (
                            <Select
                                initialValue={coverageType}
                                onChange={handleCoverageTypeChange}
                                options={COVERAGE_TYPE}
                                selectContainerClassName={styles.selectCoverageType}
                                showValueAlways
                            />
                        )}
                        <div className={styles.checkboxesWrapper}>
                            <div
                                className={`${styles.checkbox} ${
                                    isMyAppointedProducts ? styles.selectedCheckbox : ""
                                } ${!isRTS ? styles.inActive : ""}`}
                                onClick={handleMyAppointedProductsCheck}
                            >
                                {isMyAppointedProducts ? <CheckedIcon /> : <UnCheckedIcon />}{" "}
                                <span>{MY_APPOINTED_LABEL}</span>
                            </div>
                            <div
                                className={`${styles.checkbox} ${
                                    isShowExcludedProducts ? styles.selectedCheckbox : ""
                                }`}
                                onClick={handleIsShowExcludedProductsCheck}
                            >
                                {isShowExcludedProducts ? <CheckedIcon /> : <UnCheckedIcon />}{" "}
                                <span>{EXCLUDE_LABEL}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {!getAgentNonRTSLoading && (
                    <PlanDetailsContainer
                        coverageAmount={coverageAmount}
                        monthlyPremium={monthlyPremiumAmount}
                        coverageType={coverageType}
                        selectedTab={selectedTab}
                        isMyAppointedProducts={isMyAppointedProducts}
                        isShowExcludedProducts={isShowExcludedProducts}
                        handleMyAppointedProductsCheck={handleMyAppointedProductsCheck}
                        handleIsShowExcludedProductsCheck={handleIsShowExcludedProductsCheck}
                        isRTS={isRTS}
                        setIsRTS={setIsRTS}
                    />
                )}
                <div className={styles.resultContent}></div>
            </div>
        </>
    );
};

export default FinalExpensePlansResultContainer;
