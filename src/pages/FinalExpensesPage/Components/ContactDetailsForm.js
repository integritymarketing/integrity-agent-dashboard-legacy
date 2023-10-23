import React, { useEffect, useState } from "react";
import {
  StyledDescription,
  StyledElementName,
  StyledFormWrapper,
  StyledTitle,
  StyledFormRow,
  StyledFormItem,
  StyledForm,
  StyledButton,
  StyledButtonFormElement,
  StyledGenderFormElements,
  StyledHeightFormContainer,
  StyledNumberInputContainer,
  StyledNumberInputField,
  StyledUnitSpan,
  StyledSubText,
  StyledErrorText,
} from "./StyledComponents";
import { Select } from "components/ui/Select";
import {
  INITIAL_FORM_DATA,
  STATES,
  TOBACCO_USE_OPTIONS,
} from "./FinalExpensesPage.constants";
import EnrollBack from "images/enroll-btn-back.svg";
import useFetch from "hooks/useFetch";
import { useParams } from "react-router-dom";
import finalExpenseService from "services/finalExpenseService";
import { formatDate } from "utils/dates";
import DatePickerMUI from "components/DatePicker";
import moment from "moment";

const FormComponent = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errorKeys, setErrorKeys] = useState([]);
  const [zipCode, setZipCode] = useState(null);
  const [agentNpn, setAgentNpn] = useState(null);
  const { contactId } = useParams();
  const requiredKeys = ["state", "gender", "dateOfBirth", "tobaccoUse"];

  const { Get: getLeadDetails } = useFetch(
    `${process.env.REACT_APP_LEADS_URL}/api/v2.0/Leads/${contactId}`
  );

  const onChangeFormData = (formElement, value) => {
    setFormData({
      ...formData,
      [formElement]: value,
    });
    if (formElement === "weight") {
      const isInvalid = checkIfInvalidWeight(value);
      if (isInvalid) {
        setErrorKeys({
          ...errorKeys,
          weight: "Weight should be in between 10 and 999",
        });
      } else {
        const { weight, ...rest } = errorKeys;
        setErrorKeys(rest);
      }
    }
    if (formElement === "feet") {
      const isInvalid = checkIfInvalidFeet(value);
      if (isInvalid) {
        setErrorKeys({
          ...errorKeys,
          feet: "Height should be less than 8 feet",
        });
      } else {
        const { feet, ...rest } = errorKeys;
        setErrorKeys(rest);
      }
    }
    if (formElement === "inches") {
      const isInvalid = checkIfInvalidInches(value);
      if (isInvalid) {
        setErrorKeys({
          ...errorKeys,
          inches: "Inches should be less than 12",
        });
      } else {
        const { inches, ...rest } = errorKeys;
        setErrorKeys(rest);
      }
    }
  };

  const checkIfInvalidWeight = (weight) => {
    return weight && (+weight < 10 || +weight > 999);
  };

  const checkIfInvalidFeet = (feet) => {
    return feet && (+feet > 8 || +feet < 0);
  };

  const checkIfInvalidInches = (inches) => {
    return inches && (+inches > 12 || +inches < 0);
  };

  const isValidForm = () => {
    let errors = {};
    requiredKeys.forEach((key) => {
      if (!formData[key]) {
        errors = { ...errors, [key]: "is required" };
      }
    });
    const isInvalid = checkIfInvalidWeight(formData.weight);
    if (isInvalid) {
      errors = { ...errors, weight: "Weight should be in between 10 and 999" };
    }
    setErrorKeys(errors);
    return errors;
  };

  const isInvalid = (formElement) => {
    return Object.keys(errorKeys).includes(formElement);
  };

  const onSubmit = async () => {
    const { feet, inches, weight, dateOfBirth, gender, state, tobaccoUse } =
      formData;

    if (isValidForm()) {
      let payload = {
        leadId: contactId,
        agentNpn: agentNpn,
        HeightInInches: feet * 12 + inches,
        DateOfBirth: moment(dateOfBirth).format("YYYY-MM-DD"),
        Amount: 15000,
        amount_type: "Level",
        coverage_type: "face",
        ReturnOfPremium: true,
        TermLength: "30",
        MedSuppPlanCode: "a",
        Zipcode: zipCode,
        PaymentType: "bank_draft_eft",
        Sex: gender.toLowerCase(),
        State: state.toLowerCase(),
        Tobacco: tobaccoUse,
        Toolkit: "fex",
        WeightInPounds: weight || null,
      };
      await finalExpenseService.createFinalExpense(payload);
      setFormData({ ...INITIAL_FORM_DATA, dateOfBirth: null });
    }
  };

  const disableButton = () => {
    return (
      requiredKeys.some((key) => !formData[key]) ||
      checkIfInvalidWeight(formData.weight)
    );
  };

  useEffect(() => {
    const getContactLead = async () => {
      const data = await getLeadDetails();
      onChangeFormData("state", data.addresses[0].stateCode);
      setZipCode(data.addresses[0].postalCode);
      setAgentNpn(data.agentNpn);
    };
    getContactLead();
  }, [contactId]);

  return (
    <div>
      <StyledFormWrapper>
        <StyledTitle>Let's confirm a few details</StyledTitle>
        <StyledDescription>
          Just a few quick and easy questions to get your quote
        </StyledDescription>
        <StyledForm>
          <StyledFormRow>
            <StyledFormItem>
              <StyledElementName>State*</StyledElementName>
              <Select
                error={isInvalid("state")}
                options={STATES}
                initialValue={formData.state}
                onChange={(value) => {
                  onChangeFormData("state", value);
                }}
                showValueAlways={true}
              />
              {errorKeys.state && (
                <StyledErrorText>State is required</StyledErrorText>
              )}
            </StyledFormItem>
            <StyledFormItem>
              <StyledElementName>Height</StyledElementName>
              <StyledHeightFormContainer>
                <StyledNumberInputContainer>
                  <StyledNumberInputField
                    type="number"
                    value={formData.feet}
                    onChange={({ target }) => {
                      onChangeFormData("feet", target.value);
                    }}
                  />
                  <StyledUnitSpan>ft</StyledUnitSpan>
                </StyledNumberInputContainer>

                <StyledNumberInputContainer>
                  <StyledNumberInputField
                    type="number"
                    value={formData.inches}
                    onChange={({ target }) => {
                      onChangeFormData("inches", target.value);
                    }}
                  />
                  <StyledUnitSpan>in</StyledUnitSpan>
                </StyledNumberInputContainer>
              </StyledHeightFormContainer>
              <div>
                <StyledErrorText>
                  {errorKeys.feet || errorKeys.inches}
                </StyledErrorText>
              </div>
            </StyledFormItem>
          </StyledFormRow>

          <StyledFormRow>
            <StyledFormItem>
              <StyledElementName>Gender*</StyledElementName>
              <StyledGenderFormElements>
                <StyledButtonFormElement
                  selected={formData.gender === "Male"}
                  onClick={() => {
                    onChangeFormData("gender", "Male");
                  }}
                >
                  Male
                </StyledButtonFormElement>
                <StyledButtonFormElement
                  selected={formData.gender === "Female"}
                  onClick={() => {
                    onChangeFormData("gender", "Female");
                  }}
                >
                  Female
                </StyledButtonFormElement>
              </StyledGenderFormElements>
              {errorKeys.gender && (
                <StyledErrorText>Gender is required</StyledErrorText>
              )}
            </StyledFormItem>
            <StyledFormItem>
              <StyledElementName>
                Weight<StyledSubText>(lbs)</StyledSubText>
              </StyledElementName>
              <StyledNumberInputContainer style={{ width: "100%" }}>
                <StyledNumberInputField
                  type="number"
                  placeholder="Enter Weight"
                  value={formData.weight}
                  onChange={({ target }) => {
                    onChangeFormData("weight", target.value);
                  }}
                />
                {errorKeys.weight && (
                  <StyledErrorText>{errorKeys.weight}</StyledErrorText>
                )}
              </StyledNumberInputContainer>
            </StyledFormItem>
          </StyledFormRow>

          <StyledFormRow>
            <StyledFormItem>
              <StyledElementName>Date of Birth*</StyledElementName>
              <div>
                <DatePickerMUI
                  value={formData.dateOfBirth}
                  disableFuture={true}
                  onChange={(value) => {
                    onChangeFormData("dateOfBirth", formatDate(value));
                  }}
                  isMobile={true}
                />
              </div>
              {errorKeys.dateOfBirth && (
                <StyledErrorText>Date Of Birth is required</StyledErrorText>
              )}
            </StyledFormItem>
            <StyledFormItem>
              <StyledElementName>Tobacco Use*</StyledElementName>
              <div>
                <Select
                  options={TOBACCO_USE_OPTIONS}
                  initialValue={formData.tobaccoUse}
                  onChange={(value) => {
                    onChangeFormData("tobaccoUse", value);
                  }}
                  showValueAlways={true}
                />
              </div>
              {errorKeys.tobaccoUse && (
                <StyledErrorText>Tobacco Use is required</StyledErrorText>
              )}
            </StyledFormItem>
          </StyledFormRow>
        </StyledForm>
        <StyledButton onClick={onSubmit} disabled={disableButton()}>
          <span>Next</span>
          <img src={EnrollBack} alt="enroll" />
        </StyledButton>
      </StyledFormWrapper>
    </div>
  );
};

export default FormComponent;
