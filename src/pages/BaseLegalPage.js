import React from "react";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav";
import GlobalFooter from "partials/global-footer";

export default ({ children, title, ...props }) => {
  return (
    <div className="content-frame" {...props}>
      <div className="bg-photo text-invert">
        <GlobalNav />
        <Container className="scaling-header">
          <h2 className="hdg hdg--2">{title}</h2>
        </Container>
      </div>
      <Container className="mt-scale-3" size="small">
        {children}
      </Container>
      <GlobalFooter />
    </div>
  );
};
