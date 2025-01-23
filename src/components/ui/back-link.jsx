import React from "react";
import ArrowRightLong from "components/icons/arrow-right-long";

export default ({ className = "", component, children, ...props }) => {
  const LinkComponent = component;
  return (
    <LinkComponent
      className={`link link--inherit link--icon ${className}`}
      {...props}
    >
      <ArrowRightLong className="icon-flip mr-1" />
      <span className="text-bold">{children}</span>
    </LinkComponent>
  );
};
