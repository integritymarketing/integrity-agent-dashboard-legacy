import { useEffect, useState } from "react";
import { Select } from "components/ui/Select";
import useFetch from "hooks/useFetch";
import Radio from "components/ui/Radio";
import MinusIcon from "components/icons/minus-icon";
import PlusIcon from "components/icons/plus-icon";
import CheckedIcon from "components/icons/CheckedIcon";
import UnCheckedIcon from "components/icons/unChecked";
import { QUOTES_API_VERSION } from "services/clientsService";
import {
  COVERAGE_AMOUNT,
  COVERAGE_TYPE,
  MONTHLY_PREMIUM,
  PAYMENT_METHODS,
  STEPPER_FILTER,
} from "./OptionsSideBar.constants";
import {
  StyledCheckFilter,
  StyledCTA,
  StyledPlanOptionsFilter,
  H2Header,
  H4HeaderBold,
} from "./StyledComponents";
import styles from "./styles.module.scss";
import finalExpenseService from "services/finalExpenseService";

const OptionsSideBar = ({ contactId }) => {
  const [selectedTab, setSelectedTab] = useState(COVERAGE_AMOUNT);
  const { value, step, min, max } = STEPPER_FILTER[selectedTab];
  const [stepperValue, setStepperValue] = useState(min);
  const [coverageType, setCoverageType] = useState(COVERAGE_TYPE[0]);
  const [paymentMethod] = useState(PAYMENT_METHODS[0]);
  const [isExcludedPlans, showExcludedPlans] = useState(false);
  const [isSocialSecurityBilling, showSocialSecurityBilling] = useState(false);
  const { Post: updateFinalExpense } = useFetch(
    `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/FinalExpenses/Update`
  );

  useEffect(() => {
    setStepperValue(min);
  }, [selectedTab]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const updateFinalExpenseDetails = async () => {
      const data = await (
        await finalExpenseService.getFinalExpense(contactId)
      ).json();
      const quoteData = data[data.length - 1];
      const { CoverageType, AmountType, Amount } = quoteData;
      const body = {
        ...quoteData,
        Amount: stepperValue,
        AmountType: value,
        CoverageType: coverageType.value,
      };
      if (
        coverageType.value !== CoverageType ||
        value !== AmountType ||
        stepperValue !== Amount
      ) {
        await updateFinalExpense(body);
      }
    };
    updateFinalExpenseDetails();
  }, [coverageType, stepperValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const increment = () => {
    if (stepperValue < max) {
      setStepperValue(stepperValue + step);
    }
  };

  const decrement = () => {
    if (stepperValue > min) {
      setStepperValue(stepperValue - step);
    }
  };

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
          className={styles.input}
          value={`$${stepperValue.toLocaleString()}`}
        />
        <StyledCTA onClick={increment}>
          <PlusIcon />
        </StyledCTA>
      </div>
      <StyledPlanOptionsFilter>
        <H2Header>Plan Options</H2Header>
        <H4HeaderBold>Coverage Type</H4HeaderBold>
        <Select
          initialValue={COVERAGE_TYPE[0].value}
          onChange={(value) => setCoverageType(value)}
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
                className={styles.radioSpacing}
                value={method}
                label={method}
                checked={paymentMethod === method}
              />
            );
          })}
        </div>
        <StyledCheckFilter
          onClick={() => showSocialSecurityBilling(!isSocialSecurityBilling)}
        >
          {isSocialSecurityBilling ? <CheckedIcon /> : <UnCheckedIcon />}{" "}
          <span>{"Social Security Billing"}</span>
        </StyledCheckFilter>
        <StyledCheckFilter onClick={() => showExcludedPlans(!isExcludedPlans)}>
          {isExcludedPlans ? <CheckedIcon /> : <UnCheckedIcon />}{" "}
          <span>{"Show Excluded Plans"}</span>
        </StyledCheckFilter>
      </StyledPlanOptionsFilter>
    </>
  );
};

export default OptionsSideBar;
