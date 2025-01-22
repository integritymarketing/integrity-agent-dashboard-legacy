import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { InputAdornment, CircularProgress, Chip, Box } from "@mui/material";
import { TextInput } from "components/MuiComponents";
import ErrorIcon from "@mui/icons-material/Error";
import { debounce } from "lodash";
import * as yup from "yup";
import useFetch from "hooks/useFetch";
import { faMobile } from "@awesome.me/kit-7ab3488df1/icons/classic/light";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./styles.module.scss";

const warningMessage =
    "This phone number may not be able to receive text messages. You can still use it for phone calls.";
const errorMessage = "Invalid phone number format";
const successMessage = "This phone number can receive text messages.";
const server500Message = "There was an error validating this phone number. You can still use it for phone calls.";

/**
 * SMSPhoneNumberInput Component
 * A reusable phone number input field that verifies SMS compatibility.
 */
const SMSPhoneNumberInput = ({ label, onValidation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSMSCompatible, setIsSMSCompatible] = useState(null);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [value, setValue] = useState("");

    const { Get: validatePhone } = useFetch(
        `${import.meta.env.VITE_LEADS_URL}/api/v2.0/Leads/Validate/MobilePhoneNumber`
    );

    // Validation schema ignoring special characters and ensuring 10 digits
    const phoneSchema = yup
        .string()
        .required("Phone number is required")
        .test("is-valid-phone", errorMessage, (phone) => {
            const digitsOnly = phone.replace(/\D/g, "");
            return digitsOnly.length === 10;
        });

    const checkSMSCompatibility = useCallback(
        debounce(async (phoneNumber) => {
            if (!phoneNumber) {
                return;
            }
            try {
                setIsLoading(true);
                setMessage(null);
                const formattedPhone = phoneNumber.replace(/\D/g, "");

                const response = await validatePhone(null, false, formattedPhone);
                const isCompatible = response === true;
                setIsSMSCompatible(isCompatible);
                onValidation({
                    phoneNumber: phoneNumber,
                    status: isCompatible ? "success" : "warning",
                    message: isCompatible ? successMessage : warningMessage,
                });
                setMessage(isCompatible ? successMessage : warningMessage);
            } catch (error) {
                setIsSMSCompatible(null);
                setMessage("");
                setError(server500Message);
            } finally {
                setIsLoading(false);
            }
        }, 500),
        [onValidation]
    );

    const formatInput = (input) => {
        if (!input) {
            return "";
        }
        const digits = input.replace(/\D/g, "").slice(0, 10);
        const formatted =
            digits.length <= 3
                ? `(${digits}`
                : digits.length <= 6
                ? `(${digits.slice(0, 3)}) ${digits.slice(3)}`
                : `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        return formatted;
    };

    const onChange = (event) => {
        const inputValue = event.target.value;
        const formattedValue = formatInput(inputValue);
        setValue(formattedValue);
        setIsSMSCompatible(null);
        setError(null);

        const digitsOnly = formattedValue.replace(/\D/g, "");
        onValidation({ phoneNumber: digitsOnly, status: "", message: "" });

        try {
            phoneSchema.validateSync(formattedValue);
            if (digitsOnly.length === 10) {
                checkSMSCompatibility(formattedValue);
            }
        } catch (validationError) {
            setError(validationError.message);
        }
    };

    return (
        <div className={styles.inputContainer}>
            <TextInput
                label={label}
                value={value}
                color={isSMSCompatible === true ? "success" : message ? "warning" : error ? "error" : ""}
                onChange={onChange}
                helperText={error}
                placeholder="(###) ###-####"
                error={Boolean(error)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {isLoading ? (
                                <CircularProgress size={24} className={styles.loadingSpinner} />
                            ) : isSMSCompatible === true ? (
                                <Box>
                                    <Chip
                                        icon={<FontAwesomeIcon icon={faMobile} color="#434A51" size={"lg"} />}
                                        label="SMS"
                                        sx={{
                                            backgroundColor: "#F1F1F1",
                                            padding: "0px 0px 0px 12px",
                                            borderRadius: "4px",
                                            "MuiChip-label": {
                                                color: "#434A51",
                                                paddingLeft: "8px",
                                                paddingRight: "8px",
                                            },
                                        }}
                                    />
                                </Box>
                            ) : error ? (
                                <ErrorIcon className={styles.iconWarning} />
                            ) : null}
                        </InputAdornment>
                    ),
                }}
                fullWidth
                variant="outlined"
            />
        </div>
    );
};

SMSPhoneNumberInput.propTypes = {
    /** Label for the input field */
    label: PropTypes.string,
    /** Callback with validation results */
    onValidation: PropTypes.func,
};

export default SMSPhoneNumberInput;