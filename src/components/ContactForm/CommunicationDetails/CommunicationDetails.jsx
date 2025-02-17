import { useRef, useState, useCallback, useEffect } from "react";
import { Grid, Typography, Box } from "@mui/material";
import PropTypes from "prop-types";
import { SelectableButtonGroup } from "@integritymarketing/clients-ui-kit";
import styles from "./CommunicationDetails.module.scss";

import SMSPhoneNumberInput from "components/ui/SMSPhoneNumberInput";
import EmailInput from "components/ui/EmailInput";
import AlertMessage from "components/Alert";

const CommunicationDetails = ({ formik }) => {
    const { touched, errors, values, handleBlur, submitCount, setFieldValue } = formik;

    const emailFieldRef = useRef(null);
    const phoneFieldRef = useRef(null);

    const [validationMessages, setValidationMessages] = useState({
        email: { status: null, message: "", title: "" },
        phone: { status: null, message: "", title: "" },
    });

    const validateEmailInput = useCallback(
        ({ email, status, message, title }) => {
            setFieldValue("email", email);
            if (!values.primaryCommunication) {
                setFieldValue("primaryCommunication", "email");
            }

            setValidationMessages((prev) => ({ ...prev, email: { status, message, title } }));
        },
        [setFieldValue, values.primaryCommunication]
    );

    const validatePhoneInput = useCallback(
        ({ phone, status, message, title }) => {
            setFieldValue("phones.leadPhone", phone);
            if ( !values.primaryCommunication) {
                setFieldValue("primaryCommunication", "phone");
            }

            setValidationMessages((prev) => ({ ...prev, phone: { status, message, title } }));
        },
        [setFieldValue, values.primaryCommunication]
    );

    useEffect(() => {
        if (values?.primaryCommunication === "email") {
            if (values?.email === "") {
                // emailFieldRef.current?.focus();
                setValidationMessages(() => {
                    if (values?.phones?.leadPhone === "") {
                        return {
                            phone: { status: null, message: "", title: "" },
                            email: {
                                title: "Email",
                                status: "warning",
                                message: "Email is required",
                            },
                        };
                    } else {
                        return {
                            ...validationMessages,
                            email: {
                                title: "Email",
                                status: "warning",
                                message: "Email is required",
                            },
                        };
                    }
                });
            }
            if (values?.phones?.leadPhone === "" && values?.email) {
                setValidationMessages({
                    ...validationMessages,
                    phone: { status: null, message: "", title: "" },
                });
            }
        } else if (values?.primaryCommunication === "phone") {
            if (values?.phones?.leadPhone === "") {
                setValidationMessages(() => {
                    if (values?.email === "") {
                        return {
                            email: { status: null, message: "", title: "" },
                            phone: {
                                title: "Phone",
                                status: "warning",
                                message: "Phone is required",
                            },
                        };
                    } else {
                        return {
                            ...validationMessages,
                            phone: {
                                title: "Phone",
                                status: "warning",
                                message: "Phone is required",
                            },
                        };
                    }
                });
            }
            if (values?.email === "" && values?.phones?.leadPhone) {
                setValidationMessages({
                    ...validationMessages,
                    email: { status: null, message: "", title: "" },
                });
            }
        }
    }, [values.primaryCommunication, values.email, values.phones.leadPhone, validationMessages]);

    return (
        <Grid container spacing={2}>
            {/* Email Input */}
            <Grid item xs={12} md={6}>
                <Box>
                    <EmailInput
                        onValidation={validateEmailInput}
                        label="Email Address"
                        size="medium"
                        inputRef={emailFieldRef}
                        onBlur={handleBlur}
                    />
                    {validationMessages.email.status && (
                        <Box>
                            <AlertMessage
                                status={validationMessages.email.status}
                                title={validationMessages.email.title}
                                message={validationMessages.email.message}
                            />
                        </Box>
                    )}
                </Box>
            </Grid>

            {/* Phone Input */}
            <Grid item xs={12} md={6}>
                <Box>
                    <SMSPhoneNumberInput
                        onValidation={validatePhoneInput}
                        label="Phone Number"
                        size="medium"
                        inputRef={phoneFieldRef}
                    />
                    {validationMessages.phone.status && (
                        <Box>
                            <AlertMessage
                                status={validationMessages.phone.status}
                                title={validationMessages.phone.title}
                                message={validationMessages.phone.message}
                            />
                        </Box>
                    )}
                </Box>
            </Grid>

            {/* Primary Communication Selection */}
            <Grid item xs={12}>
                <Typography variant="h5" color="#052a63" marginBottom={0.5}>
                    Primary Contact Method*
                </Typography>
                <SelectableButtonGroup
                    buttonOptions={["Email", "Phone"]}
                    buttonClassNames={["email", "phone"].map((option) =>
                        values.primaryCommunication === option.toLowerCase()
                            ? styles.selectedOption
                            : styles.nonSelectedOption
                    )}
                    onSelect={(selected) => {
                        const selectedValue = selected.toLowerCase();
                        setFieldValue("primaryCommunication", selectedValue);
                    }}
                />
                {(touched.primaryCommunication || submitCount > 0) && errors.primaryCommunication && (
                    <Typography variant="body2" color="error" mt={0.5}>
                        {errors.primaryCommunication}
                    </Typography>
                )}
            </Grid>
        </Grid>
    );
};

CommunicationDetails.propTypes = {
    formik: PropTypes.shape({
        touched: PropTypes.object,
        errors: PropTypes.object,
        values: PropTypes.shape({
            primaryCommunication: PropTypes.oneOf(["email", "phone"]).isRequired,
            email: PropTypes.string,
            phones: PropTypes.shape({
                leadPhone: PropTypes.string,
            }).isRequired,
        }).isRequired,
        handleBlur: PropTypes.func.isRequired,
        submitCount: PropTypes.number.isRequired,
        setFieldValue: PropTypes.func.isRequired,
    }).isRequired,
};

export default CommunicationDetails;