/* eslint-disable max-lines-per-function */
import { useRef, useState } from "react";

import DeleteIcon from "components/icons/cross";
import ErrorIcon from "components/icons/error";
import PasswordHideIcon from "components/icons/password-hide";
import PasswordRevealIcon from "components/icons/password-reveal";
import SuccessIcon from "components/icons/success";

const Textfield = ({
    id,
    label,
    icon = null,
    type = "text",
    className = "",
    auxLink = null,
    inputClassName = "",
    wrapperProps = {},
    error = null,
    success: hasSuccess = false,
    focusBanner = null,
    focusBannerVisible = true,
    multiline = false,
    readOnly,
    value,
    onDateChange = null,
    isMobile = false,
    onClear = null,
    onReset = null,
    ...inputProps
}) => {
    const InputElement = multiline ? "textarea" : "input";
    const [passwordsVisible, setPasswordsVisible] = useState(false);
    const inputEl = useRef(null);
    const classes = [
        "form-input form-input--textfield",
        className,
        readOnly ? "form-input--readonly" : "",
        error ? "form-input--error" : "",
        hasSuccess ? "form-input--success" : "",
    ]
        .filter((x) => x.trim() !== "")
        .join(" ");
    const PasswordIcon = passwordsVisible ? PasswordHideIcon : PasswordRevealIcon;
    let displayType = type;
    if ((type === "password" && passwordsVisible) || type === "date") {
        displayType = "text";
    }

    if (type === "date" && onDateChange === null) {
        throw new Error("Textfield[type=date] components require an onDateChange handler.");
    }

    const inputElementProps = {
        readOnly,
        id,
        type: displayType,
        ref: inputEl,
        className: inputClassName,
        ...inputProps,
    };
    return (
        <div id={`${id}-wrapper`} className={classes} {...wrapperProps}>
            {label && (
                <div className="form-input__header">
                    <label htmlFor={id} className="label">
                        {label}
                    </label>
                </div>
            )}
            <div className={`form-input__input ${focusBannerVisible ? "form-input__input--show-banner" : ""}`}>
                {icon && (
                    <label htmlFor={id} className="form-input__icon form-input__icon--main" aria-hidden="true">
                        {icon}
                    </label>
                )}

                <InputElement value={value} {...inputElementProps} />

                <div className="form-input__input-actions">
                    {error && <ErrorIcon />}
                    {hasSuccess && <SuccessIcon />}
                    {type === "text" && isMobile && onClear && value && (
                        <button className="clear-btn" onClick={onClear}>
                            Clear
                        </button>
                    )}
                    {type === "text" && isMobile && onReset && (
                        <button style={{ marginTop: "4px" }} onClick={onReset}>
                            <DeleteIcon />
                        </button>
                    )}
                </div>
                {type === "password" && (
                    <button
                        type="button"
                        className="icon-btn showPassword"
                        onClick={() => {
                            setPasswordsVisible(!passwordsVisible);
                            inputEl.current.focus();
                            inputEl.current.select();
                        }}
                    >
                        <PasswordIcon className="form-input__icon" />
                        {!passwordsVisible ? "Show" : "Hide"}
                    </button>
                )}
            </div>
            {error && <div className="form-input__error">{error}</div>}
            {focusBanner && error && <div className="form-input__focus-banner">{focusBanner}</div>}
            {auxLink}
        </div>
    );
};

export const InvertedTextfield = ({ className = "", ...props }) => (
    <Textfield className={`${className} form-input--invert`} {...props} />
);

export default Textfield;
