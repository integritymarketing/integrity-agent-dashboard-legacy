import React from "react";
import Container from "components/ui/container";
import Card from "components/ui/card";
import LineItem from "components/ui/line-item";
import GlobalNav from "partials/global-nav";
import SimpleFooter from "partials/simple-footer";
import ArticleIcon from "components/icons/article";
import UpdateIcon from "components/icons/update";
import useUserProfile from "hooks/useUserProfile";

export default () => {
  const userProfile = useUserProfile();

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
          <div className="hdg hdg--3">Your Enrollment and Quoting Tools</div>
          <div className="card-grid mt-4">
            <Card>
              <div className="card__title">[FPO Product Name]</div>
              <div className="card__body">
                <p className="text-body">Powered by Connecture</p>
              </div>
              <div className="card__actions card__actions--multi">
                <button className="btn">Login</button>
                <button className="btn btn--outline">User Guide</button>
              </div>
            </Card>
            <Card>
              <div className="card__title">Enrollment Guide</div>
              <div className="card__body">
                <p className="text-body">Powered by SunfireMatrix</p>
              </div>
              <div className="card__actions card__actions--multi">
                <a href={process.env.REACT_APP_SUNFIRE_SSO_URL} className="btn">
                  Login
                </a>
                <button className="btn btn--outline">User Guide</button>
              </div>
            </Card>
            <Card>
              <div className="card__title">Product Name</div>
              <div className="card__body">
                <p className="text-body">Powered by CSG</p>
              </div>
              <div className="card__actions card__actions--multi">
                <button className="btn">Login</button>
                <button className="btn btn--outline">User Guide</button>
              </div>
            </Card>
          </div>
        </section>
        <section className="mt-scale-4">
          <div className="hdg hdg--3">Latest News &amp; Updates</div>
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
      <SimpleFooter />
    </React.Fragment>
  );
};
