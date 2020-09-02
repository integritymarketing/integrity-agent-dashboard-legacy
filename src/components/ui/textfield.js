import React, { useState, useRef } from "react";
import ErrorIcon from "components/icons/error";
import SuccessIcon from "components/icons/success";
import PasswordRevealIcon from "components/icons/password-reveal";
import PasswordHideIcon from "components/icons/password-hide";

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
  readOnly,
  ...inputProps
}) => {
  const [passwordsVisible, setPasswordsVisible] = useState(false);
  const inputEl = useRef(null);
  const classes = [
    "form-input form-input--textfield",
    className,
    !!readOnly ? "form-input--readonly" : "",
    !!error ? "form-input--error" : "",
    hasSuccess ? "form-input--success" : "",
  ]
    .filter((x) => x.trim() !== "")
    .join(" ");
  const PasswordIcon = passwordsVisible ? PasswordHideIcon : PasswordRevealIcon;
  const displayType = type === "password" && passwordsVisible ? "text" : type;
  return (
    <div className={classes} {...wrapperProps}>
      <div className="form-input__header">
        <label htmlFor={id} className="label">
          {label}
        </label>
      </div>
      <div
        className={`form-input__input ${
          focusBannerVisible ? "form-input__input--show-banner" : ""
        }`}
      >
        {icon && (
          <label
            htmlFor={id}
            className="form-input__icon form-input__icon--main"
            aria-hidden="true"
          >
            {icon}
          </label>
        )}
        <input
          {...{ readOnly, id }}
          type={displayType}
          ref={inputEl}
          className={inputClassName}
          {...inputProps}
        />
        {focusBanner && (
          <div className="form-input__focus-banner">{focusBanner}</div>
        )}
        <div className="form-input__input-actions">
          {error && <ErrorIcon />}
          {hasSuccess && <SuccessIcon />}
          {type === "password" && (
            <button
              type="button"
              className="icon-btn"
              onClick={() => {
                setPasswordsVisible(!passwordsVisible);
                inputEl.current.focus();
                inputEl.current.select();
              }}
            >
              <PasswordIcon className="form-input__icon" />
            </button>
          )}
        </div>
      </div>
      <div className="form-input__error">{error}</div>
      {auxLink}
    </div>
  );
};

export const InvertedTextfield = ({ className = "", ...props }) => (
  <Textfield className={`${className} form-input--invert`} {...props} />
);

export default Textfield;
