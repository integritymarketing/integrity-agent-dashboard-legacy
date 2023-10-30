import React, { useEffect, useState, useMemo } from "react";
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
  StyledDatePicker,
  StyledErrorWrapper,
} from "./StyledComponents";
import { Select } from "components/ui/Select";
import { INITIAL_FORM_DATA, STATES, TOBACCO_USE_OPTIONS } from "./constants";
import EnrollBack from "images/enroll-btn-back.svg";
import { useParams, useNavigate } from "react-router-dom";
import { formatDate } from "utils/dates";
import DatePickerMUI from "components/DatePicker";
import useContactDetails from "pages/ContactDetails/useContactDetails";
import { useLife } from "contexts/Life";
import useToast from "hooks/useToast";
import {
  onlyNumbersBetween1And8,
  onlyNumbersBetween1And12,
} from "utils/shared-utils/sharedUtility";

import moment from "moment";

const FormComponent = () => {
  const { contactId } = useParams();
  const { leadDetails } = useContactDetails(contactId);

  const showToast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errorKeys, setErrorKeys] = useState([]);
  const [zipCode, setZipCode] = useState(null);
  const [agentNpn, setAgentNpn] = useState(null);

  const requiredKeys = ["state", "gender", "dateOfBirth", "tobaccoUse"];

  const {
    getLifeDetails,
    lifeDetails,
    saveLifeDetails,
    editLifeDetails,
    createLifeDetailsError,
    updateLifeDetailsError,
  } = useLife();

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
      const sanitizedValue = value.replace(/[^1-8]/g, "");
      const isInvalid = checkIfInvalidFeet(sanitizedValue);
      if (isInvalid) {
        setErrorKeys({
          ...errorKeys,
          feet: "Feet should be less than 8",
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
    return feet === "";
  };

  const checkIfInvalidInches = (inches) => {
    return inches === "";
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

  const isDataUpdated = useMemo(() => {
    const { dateOfBirth, gender, state, tobaccoUse, weight, feet, inches } =
      formData;
    const heightInInches = feet * 12 + inches;

    const diff =
      lifeDetails?.DateOfBirth !== dateOfBirth ||
      formatGender(lifeDetails?.Sex) !== gender ||
      lifeDetails?.State?.toUpperCase() !== state ||
      lifeDetails?.Tobacco !== tobaccoUse ||
      lifeDetails?.WeightInPounds !== weight ||
      lifeDetails?.HeightInInches !== heightInInches;

    return diff;
  }, [formData, lifeDetails]);

  const isEdit = useMemo(() => {
    return Boolean(lifeDetails?.Id);
  }, [lifeDetails]);

  const onSubmit = async () => {
    const { feet, inches, dateOfBirth, gender, state, tobaccoUse, weight } =
      formData;

    if (isValidForm()) {
      let payload = {
        leadId: contactId,
        agentNpn: agentNpn,
        HeightInInches: feet * 12 + inches,
        DateOfBirth: moment(dateOfBirth).format("YYYY-MM-DD"),
        AgeInYears: moment().diff(moment(dateOfBirth, "YYYY"), "years"),
        Amount: 15000,
        amount_type: "face",
        coverage_type: "level",
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
      if (isEdit) {
        if (isDataUpdated) {
          payload = {
            ...payload,
            id: lifeDetails?.Id,
          };
          await editLifeDetails(payload);
        } else {
          navigate(`/final-expense-plans/${contactId}`);
        }
      } else {
        await saveLifeDetails(payload);
      }

      if (createLifeDetailsError || updateLifeDetailsError) {
        showToast({
          type: "error",
          message: "Failed to Save or Update.",
          time: 10000,
        });
      } else {
        navigate(`/final-expense-plans/${contactId}`);
      }
    }
  };

  const isValidSaveData = useMemo(() => {
    const { dateOfBirth, gender, state, tobaccoUse, weight, feet, inches } =
      formData;

    return (
      feet !== "" &&
      inches !== "" &&
      dateOfBirth !== "" &&
      gender !== "" &&
      state !== "" &&
      tobaccoUse !== "" &&
      weight !== ""
    );
  }, [formData]);

  function formatHeight(heightInInches) {
    if (typeof heightInInches !== "number" || heightInInches < 0) {
      return { feetValue: null, inchesValue: null };
    }

    const feetValue = Math.floor(heightInInches / 12);
    const inchesValue = heightInInches % 12;

    return { feetValue, inchesValue };
  }

  function formatGender(gender) {
    if (gender === "male") return "Male";
    if (gender === "female") return "Female";
    return null;
  }

  useEffect(() => {
    if (lifeDetails) {
      const {
        State,
        Zipcode,
        agentNpn,
        Tobacco,
        Sex,
        WeightInPounds,
        HeightInInches,
        DateOfBirth,
      } = lifeDetails;
      const { feetValue, inchesValue } = formatHeight(HeightInInches) || null;
      setZipCode(Zipcode);
      setAgentNpn(agentNpn);
      setFormData({
        ...formData,
        state: State.toUpperCase(),
        tobaccoUse: Tobacco,
        gender: formatGender(Sex),
        weight: WeightInPounds,
        feet: feetValue,
        inches: inchesValue,
        dateOfBirth: DateOfBirth,
      });
    } else {
      onChangeFormData("state", leadDetails?.addresses?.[0]?.stateCode || null);
      setZipCode(leadDetails?.addresses?.[0]?.postalCode || null);
      setAgentNpn(leadDetails?.agentNpn || null);
    }
  }, [lifeDetails, leadDetails]);

  useEffect(() => {
    if (contactId) {
      getLifeDetails(contactId);
    }
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
                <StyledErrorWrapper>
                  <StyledNumberInputContainer>
                    <StyledNumberInputField
                      type="text"
                      value={formData.feet}
                      maxLength="1"
                      onKeyDown={onlyNumbersBetween1And8}
                      onChange={({ target }) => {
                        onChangeFormData("feet", target.value);
                      }}
                    />
                    <StyledUnitSpan>ft</StyledUnitSpan>
                  </StyledNumberInputContainer>
                  <StyledErrorText>{errorKeys.feet}</StyledErrorText>
                </StyledErrorWrapper>
                <StyledErrorWrapper>
                  <StyledNumberInputContainer>
                    <StyledNumberInputField
                      type="text"
                      maxLength="2"
                      value={formData.inches}
                      onKeyDown={onlyNumbersBetween1And12}
                      onChange={({ target }) => {
                        onChangeFormData("inches", target.value);
                      }}
                    />
                    <StyledUnitSpan>in</StyledUnitSpan>
                  </StyledNumberInputContainer>
                  <StyledErrorText>{errorKeys.inches}</StyledErrorText>
                </StyledErrorWrapper>
              </StyledHeightFormContainer>
            </StyledFormItem>
          </StyledFormRow>

          <StyledFormRow>
            <StyledFormItem>
              <StyledElementName>Gender*</StyledElementName>
              <StyledGenderFormElements>
                <StyledButtonFormElement
                  selected={formData.gender === "male"}
                  onClick={() => {
                    onChangeFormData("gender", "male");
                  }}
                >
                  Male
                </StyledButtonFormElement>
                <StyledButtonFormElement
                  selected={formData.gender === "female"}
                  onClick={() => {
                    onChangeFormData("gender", "female");
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
              <StyledDatePicker>
                <DatePickerMUI
                  value={formData.dateOfBirth}
                  disableFuture={true}
                  onChange={(value) => {
                    onChangeFormData("dateOfBirth", formatDate(value));
                  }}
                  isMobile={true}
                />
              </StyledDatePicker>
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
        <StyledButton onClick={onSubmit} disabled={!isValidSaveData}>
          <span>Next</span>
          <img src={EnrollBack} alt="enroll" />
        </StyledButton>
      </StyledFormWrapper>
    </div>
  );
};

export default FormComponent;
