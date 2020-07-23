import React from "react";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav";

export default () => {
  return (
    <React.Fragment>
      <div className="bg-high-contrast">
        <GlobalNav />
      </div>
      <Container className="mt-scale-3">
        <div className="hdg hdg--3">Page Not Found</div>
      </Container>
    </React.Fragment>
  );
};
