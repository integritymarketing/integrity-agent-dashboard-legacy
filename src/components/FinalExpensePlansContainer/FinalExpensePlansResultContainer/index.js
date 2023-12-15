import React, { useEffect, useState } from "react";
import Media from "react-media";
import { useParams } from "react-router-dom";

import { Text } from "@integritymarketing/ui-text-components";
import PropTypes from "prop-types";
import { useLeadDetails } from "providers/ContactDetails";

import Heading4 from "packages/Heading4";

import { ContactProfileTabBar } from "components/ContactDetailsContainer";
import { CurrencyAdjuster } from "components/CurrencyAdjuster";
import CheckedIcon from "components/icons/CheckedIcon";
import UnCheckedIcon from "components/icons/unChecked";
import { Select } from "components/ui/Select";

import {
    COVERAGE_TYPE,
    COVERAGE_TYPE_HEADING,
    DEFAULT_COVERAGE_AMOUNT,
    EXCLUDE_LABEL,
    MY_APPOINTED_LABEL,
    PLAN_OPTIONS_HEADING,
    STEPPER_FILTER,
} from "./FinalExpensePlansResultContainer.constants";
import styles from "./FinalExpensePlansResultContainer.module.scss";
import { PlanDetailsContainer } from "./PlanDetailsContainer/PlanDetailsContainer";

import { COVERAGE_AMOUNT, MONTHLY_PREMIUM } from "../FinalExpensePlansContainer.constants";

const FinalExpensePlansResultContainer = ({}) => {
    const [isMobile, setIsMobile] = useState(false);
    const { contactId } = useParams();
    const [selectedTab, setSelectedTab] = useState(COVERAGE_AMOUNT);
    const [coverageAmount, setCoverageAmount] = useState(DEFAULT_COVERAGE_AMOUNT);
    const [monthlyPremiumAmount, setMonthlyPremiumAmount] = useState(STEPPER_FILTER[MONTHLY_PREMIUM].min);
    const [coverageType, setCoverageType] = useState(COVERAGE_TYPE[0].value);
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
                            <div
                                className={`${styles.checkbox} ${isMyAppointedProducts ? styles.selectedCheckbox : ""}`}
                                onClick={() => setIsMyAppointedProducts(!isMyAppointedProducts)}
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
                />
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
