import React from "react";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav";
import GlobalFooter from "partials/global-footer";

export default () => {
  return (
    <React.Fragment>
      <div className="bg-photo text-invert">
        <GlobalNav />
        <Container className="scaling-header">
          <h2 className="hdg hdg--1">Client Management</h2>
        </Container>
      </div>
      <Container className="mt-scale-3">Client List</Container>
      <GlobalFooter />
    </React.Fragment>
  );
};
