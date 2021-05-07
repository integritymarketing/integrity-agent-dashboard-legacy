import React from "react";
import PropTypes from "prop-types";
import "./button.scss";
import { Link } from "react-router-dom";

export const Button = ({ type, label, iconPosition, icon, iconOnly, href, linkTo, className, ...props }) => {
  const buttonClasses = [
    "button",
    (href || linkTo) ? 'button-link' : `button--${type}`,
    `icon-${iconPosition}`,
    iconOnly ? 'icon-only' : '',
    className || ''
  ].join(" ")

  const buttonLabel = (<>
    { icon ? icon : null}
    { iconOnly
      ? null
      : <span className="label">
        {label}
      </span>
    }
  </>)

  if (linkTo) {
    return (<Link to={linkTo} className={buttonClasses}>
      {buttonLabel}
    </Link>)
  }

  if (href) {
    return (
      <a href={href} className={buttonClasses}>
        {buttonLabel}
      </a>
    )
  }
  return (
    <button
      type="button"
      className={buttonClasses}
      {...props}
    >
      {buttonLabel}
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
  /**
   * Optional icon
   */
  icon: PropTypes.node,
  /**
   * Optional iconPosition is used for icon position orientation, By default left
   */
  iconPosition: PropTypes.string,
  /**
   * Optional icon only button indicator
   */
  iconOnly: PropTypes.bool,
  /**
   * Optional href link
   */
  href: PropTypes.string,
  /**
   * Optional linkTo to point to router link
   */
  linkTo: PropTypes.string
};

Button.defaultProps = {
  type: "primary",
  onClick: undefined,
  disabled: false,
  iconPosition: 'left',
  iconOnly: false,
  href: null,
  linkTo: null
};
