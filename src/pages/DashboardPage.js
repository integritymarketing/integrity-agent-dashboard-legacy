import React from "react";
import Container from "components/ui/container";
import Card from "components/ui/card";
import GlobalNav from "partials/global-nav";

export default () => {
  return (
    <React.Fragment>
      <div className="bg-high-contrast">
        <GlobalNav />
        <Container className="scaling-header">
          <div className="hdg hdg--2 hdg--scale-from-3">
            Welcome back, Rachel.
          </div>
          {/* TODO: hook up agent name from SSO payload */}
          <div className="hdg hdg--3 hdg--scale-from-body">
            Get quick access to your tools below.
          </div>
        </Container>
      </div>
      <Container className="mt-scale-2">
        <div className="hdg hdg--3">Enrollment Centers</div>
        <div className="card-grid mt-scale-1">
          <Card title="Medicare Center">
            <div className="card__title">
              <div className="hdg hdg--3">Medicare Center</div>
            </div>
            <div className="card__body">
              <p>Description of MC.</p>
            </div>
            <div className="card__actions">
              <button className="btn">Login</button>
            </div>
          </Card>
          <Card title="Medicare Center">
            <div className="card__title">
              <div className="hdg hdg--3">SunfireMatrix</div>
            </div>
            <div className="card__body">
              <p>Description of SM.</p>
            </div>
            <div className="card__actions">
              <button className="btn">Login</button>
            </div>
          </Card>
        </div>
      </Container>
    </React.Fragment>
  );
};
