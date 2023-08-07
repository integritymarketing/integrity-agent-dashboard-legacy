import React from "react";
import Card from "components/ui/card";

const PageCard = ({
  className = "",
  children,
  link = null,
  header = null,
  footer = null,
  scrollRef = null,
  providerModal,
  ...props
}) => {
  return (
    <Card
      className={`card--page ${providerModal && "provider-modal"} ${className}`}
      ref={scrollRef}
      {...props}
    >
      {link && <div className="card--page__link text-muted">{link}</div>}
      <div className="card--page__header">{header}</div>
      {children}
      <div className="card--page__footer">{footer}</div>
    </Card>
  );
};

export default PageCard;
