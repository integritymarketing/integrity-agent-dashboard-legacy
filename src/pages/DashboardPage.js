import React from "react";
import Container from "components/ui/container";
import Card from "components/ui/card";
import LineItem from "components/ui/line-item";
import GlobalNav from "partials/global-nav";
import ArticleIcon from "components/icons/article";
import UpdateIcon from "components/icons/update";

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
        <section>
          <div className="hdg hdg--3">Your Enrollment and Quoting Tools</div>
          <div className="card-grid mt-scale-1">
            <Card>
              <div className="card__title">[FPO Product Name]</div>
              <div className="card__body">
                <p>Powered by Connecture</p>
              </div>
              <div className="card__actions">
                <button className="btn">Login</button>
                <button className="btn btn--outline">User Guide</button>
              </div>
            </Card>
            <Card>
              <div className="card__title">Enrollment Guide</div>
              <div className="card__body">
                <p>Powered by SunfireMatrix</p>
              </div>
              <div className="card__actions">
                <button className="btn">Login</button>
                <button className="btn btn--outline">User Guide</button>
              </div>
            </Card>
            <Card>
              <div className="card__title">Product Name</div>
              <div className="card__body">
                <p>Powered by CSG</p>
              </div>
              <div className="card__actions">
                <button className="btn">Login</button>
                <button className="btn btn--outline">User Guide</button>
              </div>
            </Card>
          </div>
        </section>
        <section className="mt-scale-3">
          <div className="hdg hdg--3">Latest News &amp; Updates</div>
          <ul className="divided-vlist mt-scale-0">
            <li>
              <LineItem href="#external" icon={<ArticleIcon />}>
                What Can You Do To Save Your Medicare From Destruction By Social
                Media?
              </LineItem>
            </li>
            <li>
              <LineItem href="#external" icon={<UpdateIcon />}>
                What Can You Do To Save Your Medicare From Destruction By Social
                Media?
              </LineItem>
            </li>
          </ul>
          <div className="mt-scale-1">
            <button type="button" className="btn">
              View All
            </button>
          </div>
        </section>
      </Container>
    </React.Fragment>
  );
};
