import React from "react";
import Container from "../components/ui/container";
import Card from "../components/ui/card";
import GlobalNav from "../partials/global-nav";

export default () => {
  return (
    <React.Fragment>
      <div className="bg-brand text-invert">
        <GlobalNav />
        <Container>
          <div className="hdg hdg--2">Welcome back, Rachel.</div>
          {/* TODO: hook up agent name from SSO payload */}
          <div className="hdg hdg--3">
            Login to your enrollment center below.
          </div>
        </Container>
      </div>
      <Container>
        <div className="hdg hdg--3">Enrollment Centers</div>
        <div className="card-grid">
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
