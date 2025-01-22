import { useState, useCallback } from "react";
import { useFormik } from "formik";
import Box from "@mui/material/Box";
import * as Sentry from "@sentry/react";
import useDeviceType from "hooks/useDeviceType";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";
import useLoading from "hooks/useLoading";
import Textfield from "components/ui/textfield";
import EditIcon from "components/icons/icon-edit";
import RoundButton from "components/RoundButton";
import validationService from "services/validationService";
import analyticsService from "services/analyticsService";
import SectionContainer from "mobile/Components/SectionContainer";
import AccountMobile from "mobile/AccountPage";
import { formatPhoneNumber } from "../helper";
import styles from "./styles.module.scss";

function PersonalInfo() {
    const [isEdit, setIsEdit] = useState(false);
    const showToast = useToast();
    const loading = useLoading();
    const { isMobile } = useDeviceType();
    const { agentInformation, getAgentAvailability } = useAgentInformationByID();
    const {
        agentFirstName: firstName,
        agentLastName: lastName,
        agentNPN: npn,
        email,
        phone,
        caLicense,
    } = agentInformation;
    const formattedPhoneNumber = formatPhoneNumber(phone ?? "");
    const { Put: updateAccount } = useFetch(`${import.meta.env.VITE_AGENTS_URL}/api/v1.0/Account/Update`);

    const onSubmitHandler = useCallback(
        async (values, { setErrors, setSubmitting }) => {
            try {
                setSubmitting(true);
                const initialValues = { firstName, lastName, phone: formattedPhoneNumber, npn, caLicense, email };
                const accountDetailsChanged = Object.keys(values).some((key) => values[key] !== initialValues[key]);

                if (accountDetailsChanged) {
                    const formattedValues = {
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: values.email,
                        phone: values.phone ? values.phone.replace(/\D/g, "") : "",
                        agentStateLicenses: values.caLicense
                            ? [{ stateCode: "CA", licenseNumber: values.caLicense }]
                            : [{ stateCode: "CA", licenseNumber: "" }],
                    };
                    const response = await updateAccount(formattedValues, true);
                    if (response.status >= 200 && response.status < 300) {
                        analyticsService.fireEvent("event-form-submit", { formName: "update-account" });
                        getAgentAvailability();
                        showToast({ message: "Your account info has been updated." });
                    } else {
                        const errorsArr = await response.json();
                        analyticsService.fireEvent("event-form-submit-invalid", { formName: "update-account" });
                        setErrors(
                            validationService.formikErrorsFor(validationService.standardizeValidationKeys(errorsArr))
                        );
                        showToast({
                            type: "error",
                            message: "An error occurred while updating your account. Please try again.",
                        });
                    }
                }
            } catch (error) {
                Sentry.captureException(error);
                showToast({
                    type: "error",
                    message: "An error occurred while updating your account. Please try again.",
                });
            } finally {
                setIsEdit(false);
                setSubmitting(false);
                loading.end();
            }
        },
        [
            firstName,
            lastName,
            formattedPhoneNumber,
            npn,
            caLicense,
            email,
            updateAccount,
            getAgentAvailability,
            showToast,
            loading,
        ]
    );

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
                    ...(values.caLicense
                        ? [
                              {
                                  name: "caLicense",
                                  validator: validationService.validateCaliforniaLicenseNumber,
                                  args: ["California License Number (CLN)"],
                              },
                          ]
                        : []),
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
                            caLicense,
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
                                placeholder="Enter California License Number"
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
