import React from "react";
import ErrorIcon from "components/icons/error";
import SuccessIcon from "components/icons/success";
import ArrowDownIcon from "components/icons/arrow-down";

const SelectMenu = ({
  id,
  label,
  icon = null,
  className = "",
  auxLink = null,
  inputClassName = "",
  wrapperProps = {},
  error = null,
  success: hasSuccess = false,
  readOnly,
  ...inputProps
}) => {
  const classes = [
    "form-input form-input--select",
    className,
    !!readOnly ? "form-input--readonly" : "",
    !!error ? "form-input--error" : "",
    hasSuccess ? "form-input--success" : "",
  ]
    .filter((x) => x.trim() !== "")
    .join(" ");
  return (
    <div className={classes} {...wrapperProps}>
      <div className="form-input__header">
        <label htmlFor={id} className="label">
          {label}
        </label>
      </div>
      <div className={`form-input__input`}>
        {icon && (
          <label
            htmlFor={id}
            className="form-input__icon form-input__icon--main"
            aria-hidden="true"
          >
            {icon}
          </label>
        )}
        <select
          {...{ readOnly, id }}
          className={inputClassName}
          {...inputProps}
        />
        <div className="form-input__input-actions">
          {error && <ErrorIcon />}
          {hasSuccess && <SuccessIcon />}
          <ArrowDownIcon />
        </div>
      </div>
      <div className="form-input__error">{error}</div>
      {auxLink}
    </div>
  );
};

export default SelectMenu;
