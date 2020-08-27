import React from "react";
import ArrowRightLong from "components/icons/arrow-right-long";

const Card = ({ className = "", component, children, ...props }) => {
  const LinkComponent = component;
  return (
    <LinkComponent className={`link link--inherit ${className}`} {...props}>
      <ArrowRightLong className="icon-flip mr-1" />
      <span className="text-bold">{children}</span>
    </LinkComponent>
  );
};

export default Card;
