import React from "react";
import ArrowRightIcon from "components/icons/arrow-right";

export default ({ icon = null, children = null, className = "", ...props }) => {
  return (
    <a
      rel="nofollow noreferrer"
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
        <ArrowRightIcon />
      </span>
    </a>
  );
};
