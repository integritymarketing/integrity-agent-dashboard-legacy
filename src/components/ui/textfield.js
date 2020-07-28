import React, { useState, useRef } from "react";
import ErrorIcon from "components/icons/error";
import SuccessIcon from "components/icons/success";
import PasswordRevealIcon from "components/icons/password-reveal";

const Textfield = ({
  id,
  label,
  placeholder,
  type = "text",
  inputProps = {},
  className = "",
  auxLink = null,
  ...props
}) => {
  const [passwordsVisible, setPasswordsVisible] = useState(false);
  const inputEl = useRef(null);
  const hasError = false;
  const hasSuccess = false;
  const classes = [
    "textfield",
    className,
    hasError ? "textfield--error" : "",
    hasSuccess ? "textfield--success" : "",
  ]
    .filter((x) => x.trim() !== "")
    .join(" ");
  const displayType = type === "password" && passwordsVisible ? "text" : type;
  return (
    <div className={classes} {...props}>
      <div className="textfield__header">
        <label htmlFor={id} className="label">
          {label}
        </label>
        {auxLink}
      </div>
      <div className="textfield__input">
        <input
          id={id}
          type={displayType}
          ref={inputEl}
          placeholder={placeholder}
          {...inputProps}
        />
        <div className="textfield__input-actions">
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
              <PasswordRevealIcon />
            </button>
          )}
          {hasError && <ErrorIcon />}
          {hasSuccess && <SuccessIcon />}
        </div>
      </div>
      <div className="textfield__error mt-1">Error Message</div>
    </div>
  );
};

export default Textfield;
