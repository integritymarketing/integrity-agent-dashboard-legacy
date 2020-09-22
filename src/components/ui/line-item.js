import React from "react";
import ArrowRightIcon from "components/icons/arrow-right";

export default ({
  icon = null,
  actionIcon = <ArrowRightIcon />,
  children = null,
  className = "",
  ...props
}) => {
  return (
    <a
      rel="noopener noreferrer"
      className={`line-item ${className}`}
      {...props}
    >
      {icon && (
        <span className="line-item__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="line-item__body">{children}</span>
      <span className="line-item__next" aria-hidden="true">
        {actionIcon}
      </span>
    </a>
  );
};
