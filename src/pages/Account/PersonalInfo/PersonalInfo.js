/* eslint-disable max-lines-per-function */
import { useState } from "react";

import { useFormik } from "formik";

import Box from "@mui/material/Box";

import * as Sentry from "@sentry/react";

import useDeviceType from "hooks/useDeviceType";
import useUserProfile from "hooks/useUserProfile";
import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";
import useLoading from "hooks/useLoading";
import useAgentPreferencesData from "hooks/useAgentPreferencesData";

import Textfield from "components/ui/textfield";
import EditIcon from "components/icons/icon-edit";
import RoundButton from "components/RoundButton";

import validationService from "services/validationService";
import analyticsService from "services/analyticsService";
import authService from "services/authService";

import SectionContainer from "mobile/Components/SectionContainer";
import AccountMobile from "mobile/AccountPage";

import { formatPhoneNumber } from "../helper";

import styles from "./styles.module.scss";

function PersonalInfo() {
    const [isEdit, setIsEdit] = useState(false);
    const showToast = useToast();
    const loading = useLoading();
    const { isMobile } = useDeviceType();
    const { firstName, lastName, npn, email, phone } = useUserProfile();
    const { agentAvailability, getAgentAccountData } = useAgentPreferencesData();
    const { agentStateLicenses = [], caLicense = "" } = agentAvailability;
    const formattedPhoneNumber = formatPhoneNumber(phone ?? "");
    const { Put: updateAccount } = useFetch(`${process.env.REACT_APP_AUTH_AUTHORITY_URL}/api/v2.0/account/update`);
    const { Put: updateCALicense } = useFetch(`${process.env.REACT_APP_ACCOUNT_API}/Licenses`);


    const onSubmitHandler = async (values, { setErrors, setSubmitting }) => {
        try {
            setSubmitting(true);
            const initialValues = { firstName, lastName, phone: formattedPhoneNumber, npn, caLicense, email };
            const accountDetailsChanged = Object.keys(values).some(key => {
                const isValueChanged = key !== "caLicense" && values[key] !== initialValues[key];
                return isValueChanged;
            });

            if (values.caLicense !== caLicense) {
                await updateCALicense([{ stateCode: "CA", licenseNumber: values.caLicense }]);
                showToast({ message: "California license number has been updated." });
                await getAgentAccountData();
            }

            if (accountDetailsChanged) {
                // eslint-disable-next-line no-unused-vars
                const { caLicense: caLicenseValue, ...otherValues } = values;
                const formattedValues = {
                    ...otherValues,
                    phone: otherValues.phone ? otherValues.phone.replace(/\D/g, "") : "",
                };
                const response = await updateAccount(formattedValues, true);
                if (response.status >= 200 && response.status < 300) {
                    analyticsService.fireEvent("event-form-submit", { formName: "update-account" });
                    await authService.signinSilent();
                    showToast({ message: "Your account info has been updated." });
                } else {
                    if (response.status === 401) {
                        authService.handleExpiredToken();
                    } else {
                        const errorsArr = await response.json();
                        analyticsService.fireEvent("event-form-submit-invalid", { formName: "update-account" });
                        setErrors(
                            validationService.formikErrorsFor(validationService.standardizeValidationKeys(errorsArr))
                        );
                    }
                }
            }
        } catch (error) {
            Sentry.captureException(error);
            showToast({ message: "An error occurred while updating your account. Please try again." });
        } finally {
            setIsEdit(false);
            setSubmitting(false);
            loading.end();
        }
    };

    const { values, errors, touched, isValid, dirty, handleSubmit, handleChange, handleBlur } = useFormik({
        enableReinitialize: true,
        initialValues: {
            firstName,
            lastName,
            phone: formattedPhoneNumber,
            npn,
            caLicense,
            email,
        },
        validate: () => {
            return validationService.validateMultiple(
                [
                    {
                        name: "firstName",
                        validator: validationService.validateOnlyAlphabetics,
                        args: ["First Name"],
                    },
                    {
                        name: "lastName",
                        validator: validationService.validateOnlyAlphabetics,
                        args: ["Last Name"],
                    },
                    {
                        name: "phone",
                        validator: validationService.composeValidator([
                            validationService.validateRequired,
                            validationService.validatePhone,
                        ]),
                    },
                    {
                        name: "email",
                        validator: validationService.composeValidator([
                            validationService.validateRequired,
                            validationService.validateEmail,
                        ]),
                    },
                    {
                        name: "caLicense",
                        validator: validationService.composeValidator([
                            validationService.validateRequired,
                            validationService.validateCaliforniaLicenseNumber,
                        ]),
                    },
                ],
                values
            );
        },
        onSubmit: onSubmitHandler,
    });

    return (
        <SectionContainer
            title="Personal Information"
            actionTitle={isEdit ? "Cancel" : "Edit"}
            showLeft={isMobile}
            ActionIcon={!isEdit && <EditIcon />}
            callBack={() => {
                setIsEdit(!isEdit);
            }}
        >
            <section>
                {isMobile && !isEdit && (
                    <AccountMobile
                        data={{
                            firstName,
                            lastName,
                            phone: formattedPhoneNumber,
                            npn,
                            email,
                        }}
                    />
                )}
                {((isMobile && isEdit) || !isMobile) && (
                    <form action="" onSubmit={handleSubmit}>
                        <Box className={styles.label}>First Name</Box>
                        <Textfield
                            id="account-fname"
                            placeholder="Enter your first name"
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.firstName && errors.firstName}
                        />
                        <Box className={styles.label}>Last Name</Box>
                        <Textfield
                            id="account-lname"
                            placeholder="Enter your last name"
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.lastName && errors.lastName}
                        />
                        <Box className={styles.label}>National Producer Number (NPN)</Box>
                        <Textfield
                            id="account-npn"
                            placeholder="Enter your NPN"
                            name="npn"
                            value={values.npn}
                            readOnly
                        />
                        <>
                            <Box className={styles.label}>California License Number (CLN)</Box>
                            <Textfield
                                id="california-license-number"
                                placeholder="Enter your California License Number"
                                name="caLicense"
                                value={values.caLicense}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.caLicense && errors.caLicense}
                            />
                        </>

                        <Box className={styles.label}>Email Address</Box>
                        <Textfield
                            id="account-email"
                            type="email"
                            placeholder="Enter your email address"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.email && errors.email}
                        />
                        <Box className={styles.label}>Phone Number</Box>
                        <Textfield
                            id="account-phone"
                            type="tel"
                            placeholder="XXX-XXX-XXXX"
                            name="phone"
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={(touched.phone && errors.phone) || errors.Global}
                        />
                        <Box display="flex" justifyContent="flex-end" marginTop="20px">
                            <RoundButton type="submit" label="Save" disabled={!dirty || !isValid} />
                        </Box>
                    </form>
                )}
            </section>
        </SectionContainer>
    );
}

export default PersonalInfo;
