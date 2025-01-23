import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useField, useFormikContext } from "formik";
import cx from "classnames";
import styles from "./FormField.module.scss";
import ErrorIcon from "components/icons/error";

export const FormField = ({
    type,
    name,
    label,
    placeholder,
    onChange,
    onBlur,
    onFocus,
    required = false,
    initialValue,
    className,
    labelClassName,
    width,
    disabled,
    readOnly,
    autoComplete,
    minLength,
    maxLength,
    touched,
}) => {
    const [field, meta, helpers] = useField(name);
    const { setFieldValue } = useFormikContext();

    useEffect(() => {
        if (initialValue !== undefined && field.value === "") {
            setFieldValue(name, initialValue);
        }
    }, [initialValue, setFieldValue, name]);

    const defaultPlaceholder = useMemo(
        () => (type === "phone" ? placeholder || "(XXX) XXX-XXXX" : placeholder || `Enter ${label}`),
        [type, placeholder, label]
    );

    const handleChange = (event) => {
        helpers.setValue(event.target.value);
        if (onChange) {
            onChange(event);
        }
    };

    const hasError = touched && meta.error && Object.keys(meta.error).length > 0;

    return (
        <div className={cx(styles.inputWrapper, className)}>
            <label className={labelClassName} htmlFor={name}>
                {required ? `${label}*` : label}
            </label>
            <div className={styles.inputContainer}>
                <input
                    className={cx(styles.input, { [styles.error]: hasError })}
                    style={{ width }}
                    type={type}
                    id={name}
                    placeholder={defaultPlaceholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    autoComplete={autoComplete}
                    minLength={minLength} // Apply minLength
                    maxLength={maxLength} // Apply maxLength
                    {...field}
                    onChange={handleChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                />
                {hasError && <ErrorIcon alt="Error" className={styles.errorIcon} />}
            </div>
            {hasError && <div className={styles.error}>{`• ${meta.error}`}</div>}
        </div>
    );
};

FormField.propTypes = {
    type: PropTypes.string.isRequired, // Specifies the type of the input (e.g., 'text', 'email', 'phone')
    name: PropTypes.string.isRequired, // The name attribute of the input field, used for form submission and linking the input with Formik
    label: PropTypes.string, // The label text displayed above the input field
    placeholder: PropTypes.string, // Placeholder text shown in the input field when it's empty
    onChange: PropTypes.func, // Custom onChange handler, triggered when the input value changes
    onBlur: PropTypes.func, // Custom onBlur handler, triggered when the input loses focus
    onFocus: PropTypes.func, // Custom onFocus handler, triggered when the input gains focus
    required: PropTypes.bool, // Indicates if the field is required for form submission
    initialValue: PropTypes.any, // Initial value for the input field, used when resetting the form
    className: PropTypes.string, // Custom CSS class for styling the outer container of the input field
    labelClassName: PropTypes.string, // Custom CSS class for styling the label of the input field
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Sets the width of the input field, can be a number (pixels) or a string (percentage, em, etc.)
    disabled: PropTypes.bool, // Disables the input field when true
    readOnly: PropTypes.bool, // Makes the input field read-only when true
    autoComplete: PropTypes.string, // Controls the browser's autocomplete feature for this input field
    minLength: PropTypes.number, // Sets the minimum number of characters required in the input field
    maxLength: PropTypes.number, // Sets the maximum number of characters allowed in the input field
};
