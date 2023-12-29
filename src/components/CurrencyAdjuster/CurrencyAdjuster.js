import MinusIcon from "components/icons/minus-icon";
import PlusIcon from "components/icons/plus-icon";

import styles from "./CurrencyAdjuster.module.scss";
import { StyledCTA } from "./StyledComponents";

import {
    COVERAGE_AMOUNT,
    MONTHLY_PREMIUM,
} from "../FinalExpensePlansContainer/FinalexpensePlanOptioncard/FinalexpensePlanOptioncard.constants";

const CurrencyAdjuster = ({
    selectedTab,
    setSelectedTab,
    stepperValue,
    increment,
    decrement,
    onChange,
    onBlur,
    inputErrorStyle,
}) => {
    return (
        <>
            <div className={styles.amountStepperWrapper}>
                <div
                    className={selectedTab === COVERAGE_AMOUNT ? styles.selected : ""}
                    onClick={() => setSelectedTab(COVERAGE_AMOUNT)}
                >
                    {COVERAGE_AMOUNT}
                </div>
                <div
                    className={selectedTab === MONTHLY_PREMIUM ? styles.selected : ""}
                    onClick={() => setSelectedTab(MONTHLY_PREMIUM)}
                >
                    {MONTHLY_PREMIUM}
                </div>
            </div>
            <div className={styles.stepper}>
                <StyledCTA onClick={decrement}>
                    <MinusIcon />
                </StyledCTA>
                <input
                    type="text"
                    onChange={onChange}
                    onBlur={onBlur}
                    className={`${styles.input} ${inputErrorStyle}`}
                    value={`$${stepperValue.toLocaleString()}`}
                />
                <StyledCTA onClick={increment}>
                    <PlusIcon />
                </StyledCTA>
            </div>
        </>
    );
};

export default CurrencyAdjuster;
