import React from "react";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav";

export default () => {
  return (
    <React.Fragment>
      <div className="bg-brand text-invert">
        <GlobalNav />
      </div>
      <Container>
        <div className="hdg hdg--3">Training</div>
      </Container>
    </React.Fragment>
  );
};
