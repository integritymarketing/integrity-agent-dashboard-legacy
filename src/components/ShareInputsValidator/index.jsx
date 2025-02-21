import React, { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import { FormControl, RadioGroup, FormControlLabel, Radio, Select, MenuItem, Typography } from "@mui/material";
import { useLeadDetails } from "providers/ContactDetails";

import { disableTextMessage, getCommunicationOptions } from "utilities/appConfig";
import SMSPhoneNumberInput from "components/ui/SMSPhoneNumberInput";
import EmailInput from "components/ui/EmailInput";
import AlertMessage from "components/Alert";
import { toNumber } from "lodash";

export const __formatPhoneNumber = (phoneNumberString) => {
    const originalInput = phoneNumberString;
    const cleaned = `${phoneNumberString}`.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
    }

    if (cleaned === "") {
        return null;
    }

    return originalInput;
};

const ShareInputsValidator = ({
    leadId,
    title = "",
    setNewSelectedType = () => {},
    setExistingSendType = () => {},
    existingSendType = "",
    newSelectedType = "",
    email,
    phone,
    setEmail = () => {},
    setPhone = () => {},
}) => {
    const { validateEmail, validatePhone, updateLeadPhone, leadDetails } = useLeadDetails();

    const { emails = [], phones = [] } = leadDetails;

    const leadEmail = emails?.find(({ leadEmail }) => leadEmail)?.leadEmail ?? "";
    const leadPhone = phones?.find(({ leadPhone }) => leadPhone)?.leadPhone ?? "";
    const isEmailCompatabileStatus = emails?.find(({ leadEmail }) => leadEmail)?.isValid;
    const isPhoneCompatabileStatus = phones?.find(({ leadPhone }) => leadPhone)?.isSmsCompatible;
    const phoneId = phones?.find(({ leadPhone }) => leadPhone)?.phoneId ?? null;
    const phoneLabel = phones?.find(({ leadPhone }) => leadPhone)?.phoneLabel ?? null;

    const [isEmailCompatabile, setIsEmailCompatabile] = useState(isEmailCompatabileStatus);
    const [isPhoneCompatabile, setIsPhoneCompatabile] = useState(isPhoneCompatabileStatus);

    const [validationMessages, setValidationMessages] = useState({
        email: { status: null, message: "", title: "" },
        phone: { status: null, message: "", title: "" },
    });

    const validateEmailInput = useCallback(
        ({ email, status, message, title }) => {
            if (status === "success") {
                setEmail(email);
            } else {
                setEmail("");
            }
            setValidationMessages((prev) => ({ ...prev, email: { status, message, title } }));
        },
        [setEmail]
    );

    const validatePhoneInput = useCallback(
        ({ phone, status, message, title }) => {
            if (status === "success") {
                setPhone(phone);
            } else {
                setPhone("");
            }
            setValidationMessages((prev) => ({ ...prev, phone: { status, message, title } }));
        },
        [setPhone]
    );

    const handleSelectNewMethod = (value) => {
        setNewSelectedType(value);
        setEmail("");
        setPhone("");
        setValidationMessages({
            email: { status: null, message: "", title: "" },
            phone: { status: null, message: "", title: "" },
        });
    };

    const checkEmailValidity = useCallback(
        async (email) => {
            try {
                const response = await validateEmail(email);
                const isValid = response === true;
                setIsEmailCompatabile(isValid);
            } catch (error) {
                setIsEmailCompatabile(null);
            }
        },
        [validateEmail]
    );

    const checkPhoneValidity = useCallback(
        async (phone) => {
            try {
                const payload = {
                    leadsId: toNumber(leadId),
                    phones: [
                        {
                            leadPhone: phone,
                            phoneId,
                            phoneLabel,
                        },
                    ],
                };
                const response = await updateLeadPhone(payload);
                if (response) {
                    setIsPhoneCompatabile(true);
                } else {
                    setIsPhoneCompatabile(false);
                }
            } catch (error) {
                setIsPhoneCompatabile(null);
            }
        },
        [validatePhone]
    );

    useEffect(() => {
        if (leadEmail && isEmailCompatabile === null) {
            checkEmailValidity(leadEmail);
        }
        if (leadPhone && isPhoneCompatabile === null) {
            checkPhoneValidity(leadPhone);
        }
    }, [leadEmail, isEmailCompatabile, checkEmailValidity, leadPhone, isPhoneCompatabile, checkPhoneValidity]);

    return (
        <Box>
            <Box>
                <FormControl>
                    <Typography variant="body1" color="#434A51" marginBottom={2}>
                        {title}
                    </Typography>
                    <Box>
                        <RadioGroup
                            value={existingSendType}
                            onChange={(event) => setExistingSendType(event.target.value)}
                        >
                            {leadEmail && isEmailCompatabile && (
                                <FormControlLabel
                                    value="email"
                                    control={<Radio />}
                                    label={
                                        <Box display="flex">
                                            <Typography variant="h5" color="#052A63" marginRight="4px">
                                                Email:
                                            </Typography>
                                            <Typography variant="body1" color="#434A51">
                                                {leadEmail}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            )}
                            {leadPhone && !disableTextMessage && isPhoneCompatabile && (
                                <FormControlLabel
                                    value="textMessage"
                                    control={<Radio />}
                                    label={
                                        <Box display="flex">
                                            <Typography variant="h5" color="#052A63" marginRight="4px">
                                                Text
                                            </Typography>
                                            <Typography variant="body1" color="#434A51">
                                                {__formatPhoneNumber(leadPhone)}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            )}
                            <FormControlLabel
                                value="newEmailOrMobile"
                                control={<Radio />}
                                label={
                                    disableTextMessage ? (
                                        <Typography variant="body1" color="#434A51" marginRight="4px">
                                            New Email
                                        </Typography>
                                    ) : (
                                        <Typography variant="body1" color="#434A51" marginRight="4px">
                                            New Email Or Mobile Number
                                        </Typography>
                                    )
                                }
                            />
                        </RadioGroup>
                    </Box>
                </FormControl>
                {existingSendType === "newEmailOrMobile" && (
                    <>
                        <Box display={"flex"} width="90%" margin="auto">
                            <Box display="flex" flexDirection="column" marginBottom={2} marginRight={1}>
                                <Typography variant="h5" color="#052a63" marginBottom={0.5}>
                                    Method
                                </Typography>
                                <Select
                                    size="small"
                                    value={newSelectedType}
                                    onChange={(event) => handleSelectNewMethod(event.target.value)}
                                    displayEmpty
                                >
                                    {getCommunicationOptions().map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                            <Box width={"100%"}>
                                {newSelectedType === "email" ? (
                                    <>
                                        <EmailInput
                                            onValidation={validateEmailInput}
                                            label="Email Address"
                                            size="small"
                                        />
                                    </>
                                ) : (
                                    <Box>
                                        <SMSPhoneNumberInput
                                            onValidation={validatePhoneInput}
                                            label="Phone Number"
                                            size="small"
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Box>
                        <Box width={"90%"} margin="auto">
                            {newSelectedType === "email" && validationMessages.email.status && (
                                <Box>
                                    <AlertMessage
                                        status={validationMessages.email.status}
                                        title={validationMessages.email.title}
                                        message={validationMessages.email.message}
                                    />
                                </Box>
                            )}
                            {newSelectedType === "mobile" && validationMessages.phone.status && (
                                <Box>
                                    <AlertMessage
                                        status={validationMessages.phone.status}
                                        title={validationMessages.phone.title}
                                        message={validationMessages.phone.message}
                                    />
                                </Box>
                            )}
                        </Box>
                    </>
                )}

                <Box width={"90%"} margin="auto">
                    {existingSendType === "email" && isEmailCompatabileStatus !== true && (
                        <Box>
                            <AlertMessage
                                status="error"
                                title="Email is Undeliverable"
                                message="This email address may not be able to receive emails. Please verify the address."
                            />
                        </Box>
                    )}
                    {existingSendType === "textMessage" && isPhoneCompatabileStatus !== true && (
                        <Box>
                            <AlertMessage
                                status="error"
                                title="Texting Unavailable"
                                message="This phone number may not be able to receive text messages. You can still use it for phone calls."
                            />
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default ShareInputsValidator;