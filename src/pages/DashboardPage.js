import React from "react";
import Container from "components/ui/container";
import LineItem from "components/ui/line-item";
import GlobalNav from "partials/global-nav";
import GlobalFooter from "partials/global-footer";
import ArticleIcon from "components/icons/article";
import UpdateIcon from "components/icons/update";

export default () => {
  return (
    <React.Fragment>
      <div className="bg-photo text-invert">
        <GlobalNav />
        <Container className="scaling-header">
          <div className="mod-row">
            <div className="mod text-center">
              <div className="pb-1">
                <div className="tool-icon">MA</div>
              </div>
              <div className="mt-2">
                <h2 className="hdg hdg--3">Medicare Advantage/PDP</h2>
              </div>
              <div className="mt-1">
                <p className="text-body">
                  Quote and enroll Medicare Advantage and PDP clients into the
                  right plan quickly and easily
                </p>
              </div>
              <div className="pt-2 mt-auto">
                <button className="btn btn--invert">Open</button>
              </div>
            </div>

            <div className="mod text-center">
              <div className="pb-1">
                <div className="tool-icon">MS</div>
              </div>
              <div className="mt-2">
                <h2 className="hdg hdg--3">Medicare Supplement</h2>
              </div>
              <div className="mt-1">
                <p className="text-body">
                  Quote and compare Medicare Supplement plans by location,
                  carrier, and more
                </p>
              </div>
              <div className="pt-2 mt-auto">
                <a
                  href={process.env.REACT_APP_SUNFIRE_SSO_URL}
                  className="btn btn--invert"
                >
                  Open
                </a>
              </div>
            </div>

            <div className="mod text-center">
              <div className="pb-1">
                <div className="tool-icon">CM</div>
              </div>
              <div className="mt-2">
                <h2 className="hdg hdg--3">Client Management</h2>
              </div>
              <div className="mt-1">
                <p className="text-body">
                  Manage client information and relationships
                </p>
              </div>
              <div className="pt-2 mt-auto">
                <button className="btn btn--invert">Open</button>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Container className="mt-scale-3">
        <section>
          <div className="hdg hdg--1">Learning Center</div>
          <p className="text-body text-muted mt-1">
            Explore resources designed to help you meet client needs and grow
            your business.
          </p>
          <ul className="divided-vlist mt-2">
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
          <div className="mt-4 sf-text-center">
            <button type="button" className="btn">
              View All
            </button>
          </div>
        </section>
      </Container>
      <GlobalFooter />
    </React.Fragment>
  );
};
