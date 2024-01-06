import { useEffect, useState } from "react";

import { CurrencyAdjuster } from "components/CurrencyAdjuster";
import CheckedIcon from "components/icons/CheckedIcon";
import UnCheckedIcon from "components/icons/unChecked";
import Radio from "components/ui/Radio";
import { Select } from "components/ui/Select";

import { useLife } from "contexts/Life";

import {
    COVERAGE_AMOUNT,
    MONTHLY_PREMIUM,
    PAYMENT_METHODS,
    STEPPER_FILTER,
} from "./FinalexpensePlanOptioncard.constants";
import {
    H2Header,
    H4HeaderBold,
    StyledCheckFilter,
    StyledPlanDetailsWrapper,
    StyledPlanOptionsFilter,
} from "./StyledComponents";
import styles from "./styles.module.scss";

import { COVERAGE_TYPE } from "../FinalExpensePlansContainer.constants";

const FinalexpensePlanOptioncard = ({ contactId }) => {
    const [selectedTab, setSelectedTab] = useState(COVERAGE_AMOUNT);
    const { value, step, min, max } = STEPPER_FILTER[selectedTab];
    const [stepperValue, setStepperValue] = useState(min);
    const [coverageType, setCoverageType] = useState(COVERAGE_TYPE[4]);
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
    const [isExcludedPlans, showExcludedPlans] = useState(false);
    const [isSocialSecurityBilling, showSocialSecurityBilling] = useState(false);

    const { getLifeDetails, lifeDetails, editLifeDetails } = useLife();

    useEffect(() => {
        setStepperValue(min);
    }, [selectedTab]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (lifeDetails) {
            const { Amount, CoverageType, PaymentType, AmountType } = lifeDetails;
            setStepperValue(Amount);
            setCoverageType({ value: CoverageType });
            setPaymentMethod(PaymentType);
            setSelectedTab(AmountType === "face" ? COVERAGE_AMOUNT : MONTHLY_PREMIUM);
        }
    }, [lifeDetails]);

    useEffect(() => {
        if (contactId) {
            getLifeDetails(contactId);
        }
    }, [contactId]);

    const updateFinalExpenseDetails = async () => {
        const { CoverageType, AmountType, Amount } = lifeDetails;
        const body = {
            ...lifeDetails,
            Amount: stepperValue,
            AmountType: value,
            CoverageType: coverageType?.value || CoverageType,
            PaymentType: paymentMethod,
        };
        if (coverageType?.value !== CoverageType || value !== AmountType || stepperValue !== Amount) {
            await editLifeDetails(body);
        }
    };

    const increment = () => {
        if (stepperValue < max) {
            setStepperValue(stepperValue + step);
            updateFinalExpenseDetails();
        }
    };

    const decrement = () => {
        if (stepperValue > min) {
            setStepperValue(stepperValue - step);
            updateFinalExpenseDetails();
        }
    };

    const handleCoverageTypeChange = (value) => {
        setCoverageType(value);
        updateFinalExpenseDetails();
    };

    const handlePaymentMethodChange = (value) => {
        setPaymentMethod(value);
        updateFinalExpenseDetails();
    };

    return (
        <StyledPlanDetailsWrapper>
            <CurrencyAdjuster
                stepperValue={stepperValue}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                increment={increment}
                decrement={decrement}
            />

            <StyledPlanOptionsFilter>
                <H2Header>Plan Options</H2Header>
                <H4HeaderBold>Coverage Type</H4HeaderBold>
                <Select
                    initialValue={COVERAGE_TYPE[4].value}
                    onChange={handleCoverageTypeChange}
                    options={COVERAGE_TYPE}
                    style={{ color: "#717171", fontSize: "16px" }}
                    showValueAlways
                />
                <H4HeaderBold>Payment Method</H4HeaderBold>
                <div className={styles.paymentTypeWrapper}>
                    {PAYMENT_METHODS.map((method) => {
                        return (
                            <Radio
                                htmlFor="paymentMethod"
                                id={method}
                                name="PaymentMethod"
                                className={`${styles.radioSpacing} ${
                                    paymentMethod === method ? styles.selectedRadio : ""
                                }`}
                                value={method}
                                label={method}
                                checked={paymentMethod === method}
                                onChange={(e) => handlePaymentMethodChange(e.target.value)}
                            />
                        );
                    })}
                </div>
                <StyledCheckFilter onClick={() => showSocialSecurityBilling(!isSocialSecurityBilling)}>
                    {isSocialSecurityBilling ? <CheckedIcon /> : <UnCheckedIcon />}{" "}
                    <span>{"Social Security Billing"}</span>
                </StyledCheckFilter>
                <StyledCheckFilter onClick={() => showExcludedPlans(!isExcludedPlans)}>
                    {isExcludedPlans ? <CheckedIcon /> : <UnCheckedIcon />} <span>{"Show Excluded Plans"}</span>
                </StyledCheckFilter>
            </StyledPlanOptionsFilter>
        </StyledPlanDetailsWrapper>
    );
};

export default FinalexpensePlanOptioncard;
2;
