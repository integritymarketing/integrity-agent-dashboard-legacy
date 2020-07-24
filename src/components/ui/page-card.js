import React from "react";
import Card from "components/ui/card";

export default ({ className = "", children, link = null, ...props }) => {
  return (
    <Card className={`card--page ${className}`} {...props}>
      {link && <div className="card--page__link text-muted">{link}</div>}
      {children}
    </Card>
  );
};
