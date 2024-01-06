import React, { useEffect, useMemo, useState } from "react";
import Media from "react-media";
import { useParams } from "react-router-dom";

import { Text } from "@integritymarketing/ui-text-components";
import PropTypes from "prop-types";
import { useLeadDetails } from "providers/ContactDetails";

import usePreferences from "hooks/usePreferences";
import useRoles from "hooks/useRoles";

import Heading4 from "packages/Heading4";

import { ContactProfileTabBar } from "components/ContactDetailsContainer";
import { CurrencyAdjuster } from "components/CurrencyAdjuster";
import CheckedIcon from "components/icons/CheckedIcon";
import UnCheckedIcon from "components/icons/unChecked";
import { Select } from "components/ui/Select";

import {
    COVERAGE_AMT_VALIDATION,
    COVERAGE_TYPE,
    COVERAGE_TYPE_HEADING,
    DEFAULT_COVERAGE_AMOUNT,
    DEFAULT_MONTHLY_PREMIUM,
    EXCLUDE_LABEL,
    MONTHLY_PREMIUM_VALIDATION,
    MY_APPOINTED_LABEL,
    PLAN_OPTIONS_HEADING,
    STEPPER_FILTER,
} from "./FinalExpensePlansResultContainer.constants";
import styles from "./FinalExpensePlansResultContainer.module.scss";
import { PlanDetailsContainer } from "./PlanDetailsContainer/PlanDetailsContainer";

import { COVERAGE_AMOUNT, MONTHLY_PREMIUM } from "../FinalExpensePlansContainer.constants";

const FinalExpensePlansResultContainer = () => {
    const [isMobile, setIsMobile] = useState(false);
    const { contactId } = useParams();
    const { isNonRTS_User } = useRoles();

    const [selectedTab, setSelectedTab] = useState(COVERAGE_AMOUNT);
    const { min: covMin, max: covMax, step: covStep } = STEPPER_FILTER[COVERAGE_AMOUNT];
    const { min, max, step } = STEPPER_FILTER[MONTHLY_PREMIUM];
    const { getLeadDetails } = useLeadDetails();

    const [coverageAmount, setCoverageAmount] = usePreferences(DEFAULT_COVERAGE_AMOUNT, "coverage");
    const [monthlyPremiumAmount, setMonthlyPremiumAmount] = usePreferences(DEFAULT_MONTHLY_PREMIUM, "monthlyPremium");
    const [coverageType, setCoverageType] = usePreferences(COVERAGE_TYPE[4].value, "sessionCoverageType");
    const [isMyAppointedProducts, setIsMyAppointedProducts] = usePreferences(false, "sessionIsMyAppointedProducts");
    const [isShowExcludedProducts, setIsShowExcludedProducts] = usePreferences(false, "sessionIsShowExcludedProducts");
    const [sessionLead, setSessionLead] = usePreferences(null, "sessionLead");
    // Effects
    useEffect(() => {
        getLeadDetails(contactId);
    }, [contactId]);

    useEffect(() => {
        if (contactId !== sessionLead) {
            setSessionLead(contactId);
            resetToDefaultPreferences();
        }
    }, [contactId, sessionLead]);

    useEffect(() => {
        if (!isNonRTS_User) {
            setIsMyAppointedProducts(true);
        } else {
            setIsMyAppointedProducts(false);
        }
    }, [isNonRTS_User]);

    // Functions
    const resetToDefaultPreferences = () => {
        setCoverageAmount(DEFAULT_COVERAGE_AMOUNT);
        setMonthlyPremiumAmount(DEFAULT_MONTHLY_PREMIUM);
        setCoverageType(COVERAGE_TYPE[4].value);
        setIsMyAppointedProducts(false);
        setIsShowExcludedProducts(false);
    };

    useEffect(() => {
        getLeadDetails(contactId);
    }, []);

    const updateCoverageAmount = (value) => {
        setCoverageAmount(value);
    };

    const updateMonthlyPremiumAmount = (value) => {
        setMonthlyPremiumAmount(value);
    };

    useEffect(() => {
        if (!isNonRTS_User) {
            setIsMyAppointedProducts(true);
        }
    }, [isNonRTS_User]);

    const increment = () => {
        if (selectedTab === COVERAGE_AMOUNT) {
            if (coverageAmount !== covMin) {
                if (coverageAmount + covStep < covMax) {
                    updateCoverageAmount(coverageAmount + covStep);
                } else setCoverageAmount(covMax);
            } else setCoverageAmount(5000);
        } else {
            if (monthlyPremiumAmount !== min) {
                if (monthlyPremiumAmount + step < max) {
                    updateMonthlyPremiumAmount(monthlyPremiumAmount + step);
                } else setMonthlyPremiumAmount(max);
            } else setMonthlyPremiumAmount(20);
        }
    };

    const decrement = () => {
        if (selectedTab === COVERAGE_AMOUNT) {
            if (coverageAmount !== covMax) {
                if (coverageAmount - covStep > covMin) {
                    updateCoverageAmount(coverageAmount - covStep);
                } else setCoverageAmount(covMin);
            } else setCoverageAmount(995000);
        } else {
            if (monthlyPremiumAmount !== max) {
                if (monthlyPremiumAmount - step > min) {
                    updateMonthlyPremiumAmount(monthlyPremiumAmount - step);
                } else setMonthlyPremiumAmount(min);
            } else setMonthlyPremiumAmount(980);
        }
    };

    const handleCoverageTypeChange = (value) => {
        setCoverageType(value);
    };

    const handleInputChange = (e) => {
        const value = +e.target.value.replace(/[^0-9]/g, "") || 0;
        if (selectedTab === COVERAGE_AMOUNT) {
            updateCoverageAmount(value);
        } else {
            updateMonthlyPremiumAmount(value);
        }
    };

    const handleTabSelect = (tab) => {
        setSelectedTab(tab);
    };

    const covAmtError = useMemo(() => {
        return coverageAmount < covMin || coverageAmount > covMax;
    }, [coverageAmount, covMin, covMax]);

    const monthlyPremError = useMemo(() => {
        return monthlyPremiumAmount < min || monthlyPremiumAmount > max;
    }, [monthlyPremiumAmount, min, max]);

    return (
        <>
            <Media
                query={"(max-width: 600px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <ContactProfileTabBar contactId={contactId} />
            <div className={`${styles.contentWrapper} ${isMobile ? styles.column : ""}`}>
                <div className={styles.filterContent}>
                    <CurrencyAdjuster
                        stepperValue={selectedTab === COVERAGE_AMOUNT ? coverageAmount : monthlyPremiumAmount}
                        selectedTab={selectedTab}
                        setSelectedTab={handleTabSelect}
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
                        <div className={styles.error}>{COVERAGE_AMT_VALIDATION}</div>
                    )}
                    {selectedTab === MONTHLY_PREMIUM && monthlyPremError && (
                        <div className={styles.error}>{MONTHLY_PREMIUM_VALIDATION}</div>
                    )}
                    <div className={styles.planOptionsBox}>
                        <Heading4 className={styles.planOptionsHeader} text={PLAN_OPTIONS_HEADING} />
                        <Text className={styles.planOptionsText} text={COVERAGE_TYPE_HEADING} />
                        <Select
                            initialValue={coverageType}
                            onChange={handleCoverageTypeChange}
                            options={COVERAGE_TYPE}
                            selectContainerClassName={styles.selectCoverageType}
                            showValueAlways
                        />
                        <div className={styles.checkboxesWrapper}>
                            <div
                                className={`${styles.checkbox} ${
                                    isMyAppointedProducts ? styles.selectedCheckbox : ""
                                } ${isNonRTS_User ? styles.inActive : ""}`}
                                onClick={() => {
                                    if (isNonRTS_User) return;
                                    setIsMyAppointedProducts(!isMyAppointedProducts);
                                }}
                            >
                                {isMyAppointedProducts ? <CheckedIcon /> : <UnCheckedIcon />}{" "}
                                <span>{MY_APPOINTED_LABEL}</span>
                            </div>
                            <div
                                className={`${styles.checkbox} ${
                                    isShowExcludedProducts ? styles.selectedCheckbox : ""
                                }`}
                                onClick={() => setIsShowExcludedProducts(!isShowExcludedProducts)}
                            >
                                {isShowExcludedProducts ? <CheckedIcon /> : <UnCheckedIcon />}{" "}
                                <span>{EXCLUDE_LABEL}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <PlanDetailsContainer
                    coverageAmount={coverageAmount}
                    monthlyPremium={monthlyPremiumAmount}
                    coverageType={coverageType}
                    selectedTab={selectedTab}
                    isMyAppointedProducts={isMyAppointedProducts}
                    isShowExcludedProducts={isShowExcludedProducts}
                    isNonRTS_User={isNonRTS_User}
                />
                <div className={styles.resultContent}></div>
            </div>
        </>
    );
};

export default FinalExpensePlansResultContainer;
