import React, { useEffect, useMemo, useState } from "react";

import { Text } from "@integritymarketing/ui-text-components";
import PropTypes from "prop-types";
import { useLeadDetails } from "providers/ContactDetails";

import Heading4 from "packages/Heading4";

import { ContactProfileTabBar } from "components/ContactDetailsContainer";
import { CurrencyAdjuster } from "components/CurrencyAdjuster";
import Checkbox from "components/ui/Checkbox";
import { Select } from "components/ui/Select";

import {
    COVERAGE_AMOUNT,
    COVERAGE_TYPE,
    COVERAGE_TYPE_HEADING,
    EXCLUDE_LABEL,
    MONTHLY_PREMIUM,
    MY_APPOINTED_LABEL,
    PLAN_OPTIONS_HEADING,
    STEPPER_FILTER,
} from "./FinalExpensePlansResultContainer.constants";
import styles from "./FinalExpensePlansResultContainer.module.scss";

const FinalExpensePlansResultContainer = ({
    contactId,
    coverageAmount,
    setCoverageAmount,
    monthlyPremiumAmount,
    setMonthlyPremiumAmount,
    coverageType,
    setCoverageType,
}) => {
    const [selectedTab, setSelectedTab] = useState(COVERAGE_AMOUNT);
    const { getLeadDetails, leadDetails } = useLeadDetails();
    const [isMyAppointedProducts, setIsMyAppointedProducts] = useState(false);
    const [isShowExcludedProducts, setIsShowExcludedProducts] = useState(false);

    useEffect(() => {
        getLeadDetails(contactId);
    }, []);

    const increment = () => {
        if (selectedTab === COVERAGE_AMOUNT) {
            if (coverageAmount < STEPPER_FILTER[COVERAGE_AMOUNT].max) {
                setCoverageAmount(coverageAmount + STEPPER_FILTER[COVERAGE_AMOUNT].step);
            }
        } else {
            if (monthlyPremiumAmount < STEPPER_FILTER[MONTHLY_PREMIUM].max) {
                setMonthlyPremiumAmount(monthlyPremiumAmount + STEPPER_FILTER[MONTHLY_PREMIUM].step);
            }
        }
    };

    const decrement = () => {
        if (selectedTab === COVERAGE_AMOUNT) {
            if (coverageAmount > STEPPER_FILTER[COVERAGE_AMOUNT].min) {
                setCoverageAmount(coverageAmount - STEPPER_FILTER[COVERAGE_AMOUNT].step);
            }
        } else {
            if (monthlyPremiumAmount > STEPPER_FILTER[MONTHLY_PREMIUM].min) {
                setMonthlyPremiumAmount(monthlyPremiumAmount - STEPPER_FILTER[MONTHLY_PREMIUM].step);
            }
        }
    };

    const handleCoverageTypeChange = (value) => {
        setCoverageType(value);
    };

    return (
        <>
            <ContactProfileTabBar />
            <div className={styles.contentWrapper}>
                <div className={styles.filterContent}>
                    <CurrencyAdjuster
                        stepperValue={selectedTab === COVERAGE_AMOUNT ? coverageAmount : monthlyPremiumAmount}
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                        increment={increment}
                        decrement={decrement}
                    />
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
                            <Checkbox
                                checked={isMyAppointedProducts}
                                onChange={() => setIsMyAppointedProducts(!isMyAppointedProducts)}
                                className={styles.checkbox1}
                                label={MY_APPOINTED_LABEL}
                            />
                            <Checkbox
                                checked={isShowExcludedProducts}
                                onChange={() => setIsShowExcludedProducts(!isShowExcludedProducts)}
                                className={styles.checkbox2}
                                label={EXCLUDE_LABEL}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.resultContent}></div>
            </div>
        </>
    );
};

// Define PropTypes
FinalExpensePlansResultContainer.propTypes = {
    contactId: PropTypes.string.isRequired,
    coverageAmount: PropTypes.number.isRequired,
    setCoverageAmount: PropTypes.func.isRequired,
    monthlyPremiumAmount: PropTypes.number.isRequired,
    setMonthlyPremiumAmount: PropTypes.func.isRequired,
    coverageType: PropTypes.string.isRequired,
    setCoverageType: PropTypes.func.isRequired,
};

export default FinalExpensePlansResultContainer;
