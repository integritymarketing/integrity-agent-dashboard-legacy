import React, { useState } from "react";
import { Link } from "react-router-dom";
import ArrowRightLongIcon from "components/icons/arrow-right-long";

export default ({
  component,
  className = "",
  name,
  desc,
  imgProps = {},
  linkProps = {},
  ...props
}) => {
  const [hasFocus, setFocusState] = useState(false);
  const DisplayComponent = component || "div";
  return (
    <DisplayComponent
      className={`link-card ${hasFocus ? "link-card--focus" : ""} ${className}`}
      {...props}
    >
      <img {...imgProps} alt="" className="link-card__img" aria-hidden="true" />
      <Link
        {...linkProps}
        className={`link-card__link text-body text-bold ${
          linkProps.className || ""
        }`}
        onFocus={() => setFocusState(true)}
        onBlur={() => setFocusState(false)}
      >
        <span className="link-card__link-text">
          <span>{name}</span> <ArrowRightLongIcon />
        </span>
      </Link>
      <p className="link-card__desc text-body">{desc}</p>
    </DisplayComponent>
  );
};
