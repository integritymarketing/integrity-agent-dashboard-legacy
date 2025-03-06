import { useState, useCallback, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { InputAdornment, CircularProgress } from "@mui/material";
import { TextInput } from "components/MuiComponents";
import ErrorIcon from "@mui/icons-material/Error";
import { debounce } from "lodash";
import * as yup from "yup";
import { useLeadDetails } from "providers/ContactDetails";
import styles from "./styles.module.scss";

const errorMessage = "Invalid email address format.";
const validEmailMessage = "This email address can receive emails.";
const serverErrorMessage = "There was an error validating this email address.";
const emailUndeliverMsg = (
  <>
    This email address may not be able to receive emails. Please verify the address.{' '}
    <span style={{ fontWeight: 'bold', color: '#434A51' }}>
      This address will not be saved.
    </span>
  </>
);

/**
 * EmailInput Component
 * A reusable email input field with validation and async compatibility check.
 */
const EmailInput = ({ label, onValidation, size, defaultValue, ...props }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(null);
    const [error, setError] = useState(null);
    const [value, setValue] = useState("");

    const { validateEmail } = useLeadDetails();
    const latestValueRef = useRef(value);
    // Email validation schema
    const emailSchema = yup
        .string()
        .email(errorMessage)
        .test("is-complete", "Incomplete email address", (email) => {
            if (!email) return false;
            const emailPattern = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i;
            return emailPattern.test(email);
        });

    const checkEmailValidity = useCallback(
        debounce(async (email) => {
            if (!email || email !== latestValueRef.current) {
                return;
            }
            try {
                setIsLoading(true);
                const response = await validateEmail(email);
                const isValid = response === true;

                setIsEmailValid(isValid);
                onValidation({
                    email,
                    title: isValid ? "Email Verified" : "Emails Undeliverable",
                    status: isValid ? "success" : "error",
                    message: isValid ? validEmailMessage : emailUndeliverMsg,
                });
            } catch (error) {
                setIsEmailValid(null);
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
        latestValueRef.current = inputValue;
        setIsEmailValid(null);
        setError(null);

        if (inputValue === "") {
            onValidation({
                title: "",
                email: inputValue,
                status: "",
                message: "",
            });
            return false;
        }

        try {
            emailSchema.validateSync(inputValue);
            checkEmailValidity(inputValue);
        } catch (validationError) {
            setError(validationError.message);
            onValidation({
                title: "",
                email: inputValue,
                status: "",
                message: "",
            });
        }
    };

    useEffect(() => {
        if (defaultValue) {
            latestValueRef.current = defaultValue;
            setValue(defaultValue);
            checkEmailValidity(defaultValue);
        }
    }, [defaultValue, checkEmailValidity]);

    return (
        <div className={styles.inputContainer}>
            <TextInput
                size={size}
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
                {...props}
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
