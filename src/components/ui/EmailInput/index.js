import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { InputAdornment, CircularProgress } from "@mui/material";
import { TextInput } from "components/MuiComponents";
import ErrorIcon from "@mui/icons-material/Error";
import { debounce } from "lodash";
import * as yup from "yup";
import useFetch from "hooks/useFetch";
import styles from "./styles.module.scss";

const errorMessage = "Invalid email address format.";
const validEmailMessage = "This email address is valid.";
const invalidEmailMessage = "Invalid email format.";
const serverErrorMessage = "There was an error validating this email address.";

/**
 * EmailInput Component
 * A reusable email input field with validation and async compatibility check.
 */
const EmailInput = ({ label, onValidation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(null);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [value, setValue] = useState("");

    const { Get: validateEmail } = useFetch(`${process.env.REACT_APP_LEADS_URL}/api/v2.0/Leads/Validate/EmailAddress`);

    // Email validation schema
    const emailSchema = yup
        .string()
        .required("Email address is required")
        .email(errorMessage)
        .test("is-complete", "Incomplete email address", (email) => {
            const emailPattern = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i;
            return emailPattern.test(email);
        });

    const checkEmailValidity = useCallback(
        debounce(async (email) => {
            if (!email) {return;}
            try {
                setIsLoading(true);
                setMessage(null);

                const response = await validateEmail(null, false, email);
                const isValid = response === true;
                setIsEmailValid(isValid);
                onValidation({
                    email,
                    status: isValid ? "success" : "error",
                    message: isValid ? validEmailMessage : invalidEmailMessage,
                });
                setMessage(isValid ? validEmailMessage : invalidEmailMessage);
            } catch (error) {
                setIsEmailValid(null);
                setMessage(null);
                setError(serverErrorMessage);
            } finally {
                setIsLoading(false);
            }
        }, 500),
        [onValidation]
    );

    const onChange = (event) => {
        const inputValue = event.target.value;
        setValue(inputValue);
        setIsEmailValid(null);
        setError(null);

        try {
            emailSchema.validateSync(inputValue);
            checkEmailValidity(inputValue);
        } catch (validationError) {
            setError(validationError.message);
        }
    };

    return (
        <div className={styles.inputContainer}>
            <TextInput
                label={label}
                value={value}
                color={isEmailValid === true ? "success" : error ? "error" : ""}
                onChange={onChange}
                helperText={error}
                placeholder="Enter your email"
                error={Boolean(error)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {isLoading ? (
                                <CircularProgress size={24} className={styles.loadingSpinner} />
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

EmailInput.propTypes = {
    /** Label for the input field */
    label: PropTypes.string,
    /** Callback with validation results */
    onValidation: PropTypes.func,
};

export default EmailInput;
