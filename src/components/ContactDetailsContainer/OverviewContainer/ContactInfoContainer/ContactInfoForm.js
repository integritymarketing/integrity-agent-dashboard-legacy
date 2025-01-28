import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";

import { Form, Formik } from "formik";
import { useLeadDetails } from "providers/ContactDetails";

import { formatDate, getLocalDateTime } from "utils/dates";
import { formatPhoneNumber } from "utils/phones";
import { primaryContactOptions } from "utils/primaryContact";
import { onlyAlphabets } from "utils/shared-utils/sharedUtility";

import useToast from "hooks/useToast";

import DatePickerMUI from "components/DatePicker";
import { Button } from "components/ui/Button";
import { Select } from "components/ui/Select";
import Textfield from "components/ui/textfield";

import CountyContext from "contexts/counties";

import { useClientServiceContext } from "services/clientServiceProvider";
import validationService from "services/validationService";

import styles from "./ContactInfoContainer.module.scss";
import { StyledElementName, StyledFormItem } from "./StyledComponents";
import { Divider, Paper, Stack, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";

import Label from "../CommonComponents/Label";
import SectionContainer from "../CommonComponents/SectionContainer";
import { ArrowForwardWithCircle } from "../Icons";
import { contactFormMaritalStatusOptions, contactFormPrefixOptions, contactFormSuffixOptions } from "utils/contactForm";

function ContactInfoForm({ editLeadDetails, setIsEditMode }) {
    const { leadDetails } = useLeadDetails();

    const {
        firstName = "",
        middleName = "",
        lastName = "",
        suffix = "",
        prefix = "",
        maritalStatus = "",
        birthdate,
        emails = [],
        phones = [],
        addresses = [],
        contactPreferences,
        contactRecordType = "prospect",
        leadsId,
        leadStatusId,
        notes,
        medicareBeneficiaryID,
        partA,
        partB,
        hasMedicAid,
        subsidyLevel,
    } = leadDetails;

    const {
        allCounties = [],
        allStates = [],
        fetchCountyAndState,
        loading: loadingCountyAndState,
    } = useContext(CountyContext);

    const showToast = useToast();
    const { clientsService } = useClientServiceContext();

    const email = emails.length > 0 ? emails[0].leadEmail : null;
    const phoneData = phones.length > 0 ? phones[0] : null;
    const addressData = addresses.length > 0 ? addresses?.[0] : null;
    const emailID = emails.length > 0 ? emails[0].emailID : 0;
    const leadAddressId = addressData && addressData.leadAddressId ? addressData.leadAddressId : 0;
    const phoneId = phoneData && phoneData.phoneId ? phoneData.phoneId : 0;

    const city = addressData && addressData.city ? addressData.city : "";
    const stateCode = addressData && addressData.stateCode ? addressData.stateCode : "";
    const address1 = addressData && addressData.address1 ? addressData.address1 : "";
    const address2 = addressData && addressData.address2 ? addressData.address2 : "";
    const county = addressData && addressData.county ? addressData.county : "";
    const countyFips = addressData && addressData.countyFips ? addressData.countyFips : "";
    const postalCode = addressData && addressData.postalCode ? addressData.postalCode : "";
    const phone = phoneData && phoneData.leadPhone ? phoneData.leadPhone : "";
    const phoneLabel = phoneData && phoneData.phoneLabel ? phoneData.phoneLabel : "mobile";

    const isPrimary = contactPreferences?.primary ? contactPreferences?.primary : "email";
    const [zipLengthValid, setZipLengthValid] = useState(false);
    const [duplicateLeadIds, setDuplicateLeadIds] = useState([]);

    useEffect(() => {
        fetchCountyAndState(postalCode);
    }, [fetchCountyAndState, postalCode]);

    const formatMbiNumber = (value) => {
        if (!value) {
            return;
        }
        let formattedValue = value.replace(/-/g, "");
        if (formattedValue.length > 4) {
            formattedValue = `${formattedValue.slice(0, 4)}-${formattedValue.slice(4)}`;
        }
        if (formattedValue.length > 8) {
            formattedValue = `${formattedValue.slice(0, 8)}-${formattedValue.slice(8)}`;
        }
        return formattedValue.toUpperCase();
    };

    const isDuplicateContact = useCallback(
        async (values, setDuplicateLeadIds) => {
            // if no phone or email, return false else check for duplicate contact
            const response = await clientsService.getDuplicateContact(values);
            if (response?.ok) {
                const resMessage = await response.json();
                // if duplicate contact, show error and return
                if (resMessage?.isExactDuplicate) {
                    setDuplicateLeadIds(resMessage?.duplicateLeadIds || []);

                    return {
                        firstName: "Duplicate Contact",
                        lastName: "Duplicate Contact",
                        isExactDuplicate: true,
                    };
                } else {
                    // if not duplicate contact, set duplicate lead ids to show in error message because it is potential duplicate contact
                    setDuplicateLeadIds(resMessage?.duplicateLeadIds || []);

                    // return false to indicate not duplicate contact
                    return {
                        isExactDuplicate: false,
                    };
                }
            } else {
                showToast({
                    message: "Issue while checking for duplicate contact",
                    type: "error",
                });

                // if error, return false to indicate not duplicate contact
                return {
                    isExactDuplicate: false,
                };
            }
        },
        [showToast],
    );

    return (
        <Formik
            initialValues={{
                firstName: firstName,
                lastName: lastName,
                middleName: middleName,
                suffix: suffix || "",
                prefix: prefix || "",
                maritalStatus: maritalStatus || "",
                email: email,
                birthdate: birthdate ? formatDate(birthdate) : "",
                phones: {
                    leadPhone: phone,
                    phoneLabel: phoneLabel?.toLowerCase(),
                },
                address: {
                    address1: address1,
                    address2: address2,
                    city: city,
                    stateCode: stateCode,
                    postalCode: postalCode,
                    county: county || "",
                    countyFips: countyFips,
                },
                maritalStatus: leadDetails?.maritalStatus || "Unknown",
                primaryCommunication: isPrimary,
                contactRecordType: contactRecordType?.toLowerCase(),
                emailID,
                leadAddressId,
                phoneId,
                leadStatusId,
                leadsId,
                notes,
                medicareBeneficiaryID: medicareBeneficiaryID ? formatMbiNumber(medicareBeneficiaryID) : "",
                partA: partA ?? "",
                partB: partB ?? "",
                hasMedicAid,
                subsidyLevel,
            }}
            validate={async (values) => {
                return validationService.validateMultiple(
                    [
                        {
                            name: "firstName",
                            validator: validationService.validateName,
                            args: ["First Name"],
                        },
                        {
                            name: "lastName",
                            validator: validationService.validateName,
                            args: ["Last Name"],
                        },
                        {
                            name: "phones.leadPhone",
                            validator: validationService.composeValidator([
                                validationService.validateRequiredIf("phone" === values.primaryCommunication),
                                validationService.validatePhone,
                            ]),
                        },
                        {
                            name: "email",
                            validator: validationService.composeValidator([
                                validationService.validateRequiredIf("email" === values.primaryCommunication),
                                validationService.validateEmail,
                            ]),
                        },
                        {
                            name: "address.postalCode",
                            validator: validationService.composeValidator([validationService.validatePostalCode]),
                        },
                        {
                            name: "address.address1",
                            validator: validationService.composeValidator([validationService.validateAddress]),
                            args: ["Address"],
                        },
                        {
                            name: "address.address2",
                            validator: validationService.composeValidator([validationService.validateAddress]),
                            args: ["Apt, Suite, Unit"],
                        },
                        {
                            name: "address.city",
                            validator: validationService.composeValidator([validationService.validateAddress]),
                        },
                        {
                            name: "birthdate",
                            validator: validationService.validateDateInput,
                            args: ["Date of Birth", "MM/dd/yyyy"],
                        },
                        {
                            name: "medicareBeneficiaryID",
                            validator: validationService.validateMedicalBeneficiaryId,
                            args: ["Medicare Beneficiary ID Number"],
                        },
                    ],
                    values,
                );
            }}
            onSubmit={async (values, { setErrors, setSubmitting }) => {
                const duplicateCheckResult = await isDuplicateContact(values, setDuplicateLeadIds);
                // if duplicate contact, show error and return and don't submit form
                if (duplicateCheckResult?.isExactDuplicate && duplicateLeadIds?.length > 1) {
                    setErrors({
                        firstName: "Duplicate Contact",
                        lastName: "Duplicate Contact",
                    });
                    const middleOfPage = document.documentElement.scrollHeight / 3;
                    window.scrollTo(0, middleOfPage);
                    setSubmitting(false);
                    return;
                }

                setSubmitting(true);
                editLeadDetails(values);
                setIsEditMode(false);
            }}
        >
            {({ values, errors, touched, isValid, dirty, handleChange, handleBlur, handleSubmit, setFieldValue }) => {
                const isInvalidZip =
                    (values.address.postalCode.length === 5 && !loadingCountyAndState && allStates?.length === 0) ||
                    (values.address.postalCode > 0 && values.address.postalCode.length < 5);
                const countyName = allCounties[0]?.value;
                const countyFipsName = allCounties[0]?.key;
                const stateCodeName = allStates[0]?.value;

                if (
                    allCounties.length === 1 &&
                    countyName !== values.address.county &&
                    countyFipsName !== values.address.countyFips
                ) {
                    setFieldValue("address.county", allCounties[0].value);
                    setFieldValue("address.countyFips", allCounties[0].key);
                }
                if (allStates.length === 1 && stateCodeName !== values.address.stateCode) {
                    setFieldValue("address.stateCode", allStates[0].value);
                }

                return (
                    <Box>
                        <div>
                            <Form>
                                <SectionContainer>
                                    <StyledFormItem>
                                        <StyledElementName>First Name</StyledElementName>

                                        <Textfield
                                            id="contact-fname"
                                            placeholder={"Enter first name"}
                                            name="firstName"
                                            className="hide-field-error"
                                            value={values.firstName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={errors.firstName ? true : false}
                                        />
                                        {touched.firstName && errors.firstName && (
                                            <ul className="details-edit-custom-error-msg">
                                                <li className="error-msg-red">{errors.firstName}</li>
                                            </ul>
                                        )}
                                    </StyledFormItem>
                                    <StyledFormItem>
                                        <StyledElementName>Middle Initial</StyledElementName>
                                        <Textfield
                                            id="contact-mname"
                                            type="text"
                                            placeholder=""
                                            maxLength="1"
                                            name="middleName"
                                            onKeyDown={onlyAlphabets}
                                            value={values.middleName?.toUpperCase()}
                                            className="custom-mob-w custom-w-px"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </StyledFormItem>
                                    <StyledFormItem>
                                        <StyledElementName>Last Name</StyledElementName>

                                        <Textfield
                                            id="contact-lname"
                                            placeholder="Enter last name"
                                            className="hide-field-error"
                                            name="lastName"
                                            value={values.lastName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={errors.lastName ? true : false}
                                        />
                                        {touched.lastName && errors.lastName && (
                                            <ul className="details-edit-custom-error-msg">
                                                <li className="error-msg-red">{errors.lastName}</li>
                                            </ul>
                                        )}
                                    </StyledFormItem>
                                    <StyledFormItem>
                                        <StyledElementName>Prefix</StyledElementName>

                                        <Select
                                            // error={isInvalid("state")}
                                            options={contactFormPrefixOptions}
                                            initialValue={values.prefix}
                                            onChange={(value) => {
                                                setFieldValue("prefix", value);
                                            }}
                                            showValueAlways={true}
                                            showEmptyOption={true}
                                        />
                                    </StyledFormItem>
                                    <StyledFormItem>
                                        <StyledElementName>Suffix</StyledElementName>

                                        <Select
                                            // error={isInvalid("state")}
                                            options={contactFormSuffixOptions}
                                            initialValue={values.suffix}
                                            onChange={(value) => {
                                                setFieldValue("suffix", value);
                                            }}
                                            showValueAlways={true}
                                            showEmptyOption={true}
                                        />
                                    </StyledFormItem>
                                    <StyledFormItem>
                                        <StyledElementName>Marital Status</StyledElementName>

                                        <Select
                                            // error={isInvalid("state")}
                                            options={contactFormMaritalStatusOptions}
                                            initialValue={values.maritalStatus}
                                            onChange={(value) => {
                                                setFieldValue("maritalStatus", value);
                                            }}
                                            showEmptyOption={true}
                                        />
                                    </StyledFormItem>
                                </SectionContainer>

                                <SectionContainer>
                                    <StyledFormItem>
                                        <StyledElementName>Birthdate</StyledElementName>
                                        <DatePickerMUI
                                            value={values.birthdate}
                                            disableFuture={true}
                                            onChange={(value) => {
                                                setFieldValue("birthdate", formatDate(value));
                                            }}
                                        />
                                        {errors.birthdate && (
                                            <ul className="details-edit-custom-error-msg">
                                                <li className="error-msg-red">{errors.birthdate}</li>
                                            </ul>
                                        )}
                                    </StyledFormItem>
                                </SectionContainer>

                                <SectionContainer>
                                    <StyledFormItem>
                                        <StyledElementName>Primary Contact</StyledElementName>

                                        <Select
                                            // error={isInvalid("state")}
                                            options={primaryContactOptions}
                                            placeholder="Phone"
                                            initialValue={values.primaryCommunication}
                                            onChange={(value) => {
                                                setFieldValue("primaryCommunication", value);
                                            }}
                                            showValueAlways={true}
                                        />
                                    </StyledFormItem>

                                    {errors.phones?.leadPhone &&
                                        values.phones?.leadPhone === "" &&
                                        values.primaryCommunication === "phone" && (
                                            <ul className="details-edit-custom-error-msg">
                                                <li className="error-msg-red">
                                                    Phone number is required to select as primary communication
                                                </li>
                                            </ul>
                                        )}

                                    {errors.email && values.email === "" && values.primaryCommunication === "email" && (
                                        <ul className="details-edit-custom-error-msg">
                                            <li className="error-msg-red">
                                                Email is required to select as primary communication
                                            </li>
                                        </ul>
                                    )}
                                </SectionContainer>

                                <SectionContainer>
                                    <StyledFormItem>
                                        <StyledElementName>Email</StyledElementName>

                                        <Textfield
                                            id="contact-email"
                                            type="email"
                                            placeholder="Enter your email address"
                                            name="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.email && errors.email}
                                        />
                                    </StyledFormItem>
                                </SectionContainer>

                                <SectionContainer>
                                    <StyledFormItem>
                                        <StyledElementName>Phone Number</StyledElementName>

                                        <Textfield
                                            id="contact-phone"
                                            type="tel"
                                            placeholder="(   )_ _ _  - _ _ _ _ "
                                            name="phones.leadPhone"
                                            value={formatPhoneNumber(values.phones.leadPhone)}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.phones?.leadPhone && errors.phones?.leadPhone}
                                        />
                                    </StyledFormItem>
                                </SectionContainer>

                                <SectionContainer>
                                    <StyledFormItem>
                                        <StyledElementName>Address</StyledElementName>

                                        <Textfield
                                            id="contact-address"
                                            className={`${styles["contact-address"]} hide-field-error`}
                                            placeholder={"Address Line 1"}
                                            name="address.address1"
                                            value={values.address.address1}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={errors.address?.address1 ? true : false}
                                        />
                                        {touched.address?.address1 && errors.address?.address1 && (
                                            <ul className="details-edit-custom-error-msg">
                                                <li className="error-msg-red">{errors.address?.address1}</li>
                                            </ul>
                                        )}
                                    </StyledFormItem>
                                    <StyledFormItem>
                                        <Textfield
                                            id="contact-address2"
                                            className={`${styles["contact-address"]} hide-field-error`}
                                            placeholder={"Enter Apt, Suite, Unit"}
                                            name="address.address2"
                                            value={values.address.address2}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={errors.address?.address2 ? true : false}
                                        />
                                        {touched.address?.address2 && errors.address?.address2 && (
                                            <ul className="details-edit-custom-error-msg">
                                                <li className="error-msg-red">{errors.address?.address2}</li>
                                            </ul>
                                        )}
                                    </StyledFormItem>
                                    <StyledFormItem>
                                        <Textfield
                                            id="contact-address__city"
                                            className={`${styles["contact-address--city"]}  hide-field-error`}
                                            placeholder={"Enter City"}
                                            name="address.city"
                                            value={values.address.city}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={errors.address?.city ? true : false}
                                        />
                                        {touched.address?.city && errors.address?.city && (
                                            <ul className="details-edit-custom-error-msg">
                                                <li className="error-msg-red">{errors.address?.city}</li>
                                            </ul>
                                        )}
                                    </StyledFormItem>
                                    <Box
                                        className={styles.horizontalLayout}
                                        display="flex"
                                        justifyContent={"space-between"}
                                        gap="10px"
                                    >
                                        <StyledFormItem>
                                            <Textfield
                                                id="contact-address__zip"
                                                className={`${styles["contact-address--zip"]} custom-address-zip hide-field-error`}
                                                label=""
                                                name="address.postalCode"
                                                placeholder="Zip Code"
                                                value={values.address.postalCode}
                                                inputprops={{ maxLength: 5 }}
                                                onChange={(e) => {
                                                    setFieldValue("address.postalCode", e.target.value);
                                                    setFieldValue("address.county", "");
                                                    setFieldValue("address.stateCode", "");
                                                    setFieldValue("address.countyFips", "");
                                                    fetchCountyAndState(e.target.value);
                                                    if (e.target.value.length < 5) {
                                                        setZipLengthValid(false);
                                                    } else {
                                                        setZipLengthValid(true);
                                                    }
                                                }}
                                                onBlur={handleBlur}
                                                onInput={(e) => {
                                                    e.target.value = e.target.value
                                                        .replace(/[^0-9]/g, "")
                                                        .toString()
                                                        .slice(0, 5);
                                                }}
                                                error={errors.address?.postalCode || isInvalidZip ? true : false}
                                            />
                                        </StyledFormItem>
                                        <StyledFormItem>
                                            <Select
                                                placeholder="State"
                                                showValueAsLabel={true}
                                                className={`${styles["contact-address--statecode"]} `}
                                                disabled={true}
                                                options={allStates}
                                                isDefaultOpen={
                                                    allStates.length > 1 && values.address.stateCode === ""
                                                        ? true
                                                        : false
                                                }
                                                initialValue={values.address.stateCode}
                                                onChange={(value) => {
                                                    setFieldValue("address.stateCode", value);
                                                }}
                                                showValueAlways={true}
                                            />
                                        </StyledFormItem>
                                    </Box>
                                    {errors.address?.postalCode && (
                                        <ul className="details-edit-custom-error-msg">
                                            <li className="error-msg-red zip-code-error-msg">
                                                {errors.address?.postalCode}
                                            </li>
                                        </ul>
                                    )}
                                    {!errors.address?.postalCode &&
                                        values.address.postalCode.length > 0 &&
                                        !loadingCountyAndState &&
                                        allStates?.length === 0 && (
                                            <ul className="details-edit-custom-error-msg">
                                                <li className="error-msg-red zip-code-error-msg">Invalid ZIP Code</li>
                                            </ul>
                                        )}
                                    <StyledFormItem style={{ width: "100%", marginTop: "10px" }}>
                                        <Select
                                            placeholder="Select County"
                                            className={`${styles["contact-address--statecode"]} `}
                                            options={allCounties}
                                            initialValue={values.address.county}
                                            isDefaultOpen={
                                                allCounties.length > 1 && values.address.county === "" ? true : false
                                            }
                                            onChange={(value) => {
                                                setFieldValue("address.county", value);
                                                const { key: fip, state } = allCounties.filter(
                                                    (item) => item.value === value,
                                                )[0];
                                                setFieldValue("address.countyFips", fip);
                                                if (allCounties.length > 1) {
                                                    setFieldValue("address.stateCode", state);
                                                }
                                            }}
                                            showValueAlways={true}
                                        />
                                    </StyledFormItem>
                                </SectionContainer>

                                <SectionContainer>
                                    <StyledFormItem>
                                        <StyledElementName>Medicare Beneficiary ID</StyledElementName>

                                        <Textfield
                                            id="mbi-number"
                                            type="text"
                                            placeholder="MBI Number"
                                            name="medicareBeneficiaryID"
                                            value={values.medicareBeneficiaryID}
                                            onChange={handleChange}
                                            onBlur={(e) => {
                                                handleBlur(e);
                                                setFieldValue(
                                                    "medicareBeneficiaryID",
                                                    formatMbiNumber(values.medicareBeneficiaryID),
                                                );
                                            }}
                                        />
                                        {errors?.medicareBeneficiaryID && (
                                            <ul className="details-edit-custom-error-msg">
                                                <li className="error-msg-red">{errors?.medicareBeneficiaryID}</li>
                                            </ul>
                                        )}
                                    </StyledFormItem>
                                </SectionContainer>

                                <SectionContainer>
                                    <StyledFormItem>
                                        <StyledElementName>Medicare Part A Effective Date</StyledElementName>

                                        <DatePickerMUI
                                            value={values.partA === null ? "" : values.partA}
                                            onChange={(value) => {
                                                setFieldValue("partA", value);
                                            }}
                                            className={styles.disableDatePickerError}
                                        />
                                        {errors.partA && (
                                            <ul className="details-edit-custom-error-msg">
                                                <li className="error-msg-red">{errors.partA}</li>
                                            </ul>
                                        )}
                                    </StyledFormItem>
                                </SectionContainer>
                                <SectionContainer>
                                    <StyledFormItem>
                                        <StyledElementName>Medicare Part B Effective Date</StyledElementName>

                                        <DatePickerMUI
                                            value={values.partB === null ? "" : values.partB}
                                            onChange={(value) => {
                                                setFieldValue("partB", value);
                                            }}
                                            className={styles.disableDatePickerError}
                                        />
                                        {errors.partB && (
                                            <ul className="details-edit-custom-error-msg">
                                                <li className="error-msg-red">{errors.partB}</li>
                                            </ul>
                                        )}
                                    </StyledFormItem>
                                </SectionContainer>
                                <SectionContainer>
                                    <Paper className={styles.specialAssistanceCard} elevation="0">
                                        <Stack className={styles.specialAssistanceFormWrapper} direction="row">
                                            <Typography className={styles.specialAssistanceHeader} variant="custom">
                                                Special Assistance
                                            </Typography>
                                            <Stack className={styles.specialAssistanceOptions}>
                                                <Typography variant="body1" color="#434A51">
                                                    Y
                                                </Typography>
                                                <Typography variant="body1" color="#434A51">
                                                    N
                                                </Typography>
                                                <Typography variant="body1" color="#434A51">
                                                    IDK
                                                </Typography>
                                            </Stack>
                                            <Stack className={styles.specialAssistanceContainer}>
                                                <Stack direction="row" className={styles.specialAssistanceRadios}>
                                                    <Typography variant="body1" color="#434A51">
                                                        Medicaid
                                                    </Typography>
                                                    <RadioGroup
                                                        row
                                                        name="hasMedicAid"
                                                        value={values.hasMedicAid}
                                                        onChange={(evt) => {
                                                            setFieldValue("hasMedicAid", evt.target.value);
                                                        }}
                                                    >
                                                        {[1, 0].map((option) => (
                                                            <FormControlLabel value={option} control={<Radio />} />
                                                        ))}
                                                    </RadioGroup>
                                                </Stack>
                                                <Divider />
                                                <Stack direction="row" className={styles.specialAssistanceRadios}>
                                                    <Typography variant="body1" color="#434A51">
                                                        LIS
                                                    </Typography>
                                                    <RadioGroup
                                                        row
                                                        name="subsidyLevel"
                                                        value={values.subsidyLevel}
                                                        onChange={(evt) => {
                                                            setFieldValue("subsidyLevel", evt.target.value);
                                                        }}
                                                    >
                                                        {["Yes", "No", "I Don't Know"].map((option) => (
                                                            <FormControlLabel value={option} control={<Radio />} />
                                                        ))}
                                                    </RadioGroup>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </Paper>
                                </SectionContainer>

                                {duplicateLeadIds?.length > 0 && (
                                    <div className={`${styles["duplicate-lead"]} mt-5 mb-4`}>
                                        <div>
                                            <Warning />
                                        </div>
                                        <div className={`${styles["duplicate-lead--text"]} pl-1`}>
                                            You can create this contact, but the entry is a potential duplicate to{" "}
                                            {duplicateLeadIds.length === 1 ? (
                                                <a
                                                    href={getContactLink(duplicateLeadIds[0])}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {`this contact link`}
                                                </a>
                                            ) : (
                                                <Link
                                                    to="/contacts"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={handleMultileDuplicates}
                                                >
                                                    {" "}
                                                    view duplicates
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Form>
                        </div>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: "20px",
                            }}
                        >
                            <Label
                                value={`Created Date: ${getLocalDateTime(leadDetails?.createDate)?.fullDate}`}
                                color="#717171"
                                size="14px"
                            />
                        </Box>
                        <Box className={styles.buttonContainer}>
                            <Button
                                label={"Cancel"}
                                className={styles.deleteButton}
                                type="tertiary"
                                onClick={() => setIsEditMode(false)}
                            />
                            <Button
                                label={"Save"}
                                className={styles.editButton}
                                disabled={!dirty || !isValid || isInvalidZip}
                                onClick={handleSubmit}
                                type="tertiary"
                                icon={<ArrowForwardWithCircle />}
                                iconPosition="right"
                            />
                        </Box>
                    </Box>
                );
            }}
        </Formik>
    );
}

export default ContactInfoForm;
