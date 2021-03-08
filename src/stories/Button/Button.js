import React from "react";
import PropTypes from "prop-types";
import "./button.scss";

export const Button = ({ type, label, ...props }) => {
  return (
    <button
      type="button"
      className={["button", `button--${type}`].join(" ")}
      {...props}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  /**
   * What type is the button?
   */
  type: PropTypes.oneOf(["primary", "secondary", "tertiary"]),
  /**
   * Button contents
   */
  label: PropTypes.string.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
  /**
   * Optional disabled state
   */
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  type: "primary",
  onClick: undefined,
  disabled: false,
};
