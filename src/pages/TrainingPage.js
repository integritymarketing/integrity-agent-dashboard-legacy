import React from "react";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav";
import GlobalFooter from "partials/global-footer";

export default () => {
  return (
    <React.Fragment>
      <div className="bg-high-contrast">
        <GlobalNav />
      </div>
      <Container className="mt-scale-2">
        <div className="hdg hdg--3">Training</div>
      </Container>
      <GlobalFooter />
    </React.Fragment>
  );
};
