import React, { useState, useRef } from "react";
import ErrorIcon from "components/icons/error";
import SuccessIcon from "components/icons/success";
import PasswordRevealIcon from "components/icons/password-reveal";
import PasswordHideIcon from "components/icons/password-hide";

const Textfield = ({
  id,
  label,
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
    "textfield",
    className,
    !!readOnly ? "textfield--readonly" : "",
    !!error ? "textfield--error" : "",
    hasSuccess ? "textfield--success" : "",
  ]
    .filter((x) => x.trim() !== "")
    .join(" ");
  const PasswordIcon = passwordsVisible ? PasswordHideIcon : PasswordRevealIcon;
  const displayType = type === "password" && passwordsVisible ? "text" : type;
  return (
    <div className={classes} {...wrapperProps}>
      <div className="textfield__header">
        <label htmlFor={id} className="label">
          {label}
        </label>
      </div>
      <div
        className={`textfield__input ${
          focusBannerVisible ? "textfield__input--show-banner" : ""
        }`}
      >
        <input
          {...{ readOnly, id }}
          type={displayType}
          ref={inputEl}
          className={inputClassName}
          {...inputProps}
        />
        {focusBanner && (
          <div className="textfield__focus-banner">{focusBanner}</div>
        )}
        <div className="textfield__input-actions">
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
              <PasswordIcon className="textfield__icon" />
            </button>
          )}
        </div>
      </div>
      <div className="textfield__error">{error}</div>
      {auxLink}
    </div>
  );
};

export const InvertedTextfield = ({ className = "", ...props }) => (
  <Textfield className={`${className} textfield--invert`} {...props} />
);

export default Textfield;
