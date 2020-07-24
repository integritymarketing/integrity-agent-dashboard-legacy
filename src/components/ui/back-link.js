import React from "react";
import ArrowRight from "components/icons/arrow-right";

const Card = ({ className = "", component, children, ...props }) => {
  const LinkComponent = component;
  return (
    <LinkComponent className={`link link--inherit ${className}`} {...props}>
      <ArrowRight className="icon-flip icon-small" />
      {children}
    </LinkComponent>
  );
};

export default Card;
