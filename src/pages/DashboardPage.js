import React from "react";
import Container from "components/ui/container";
import Card from "components/ui/card";
import LineItem from "components/ui/line-item";
import GlobalNav from "partials/global-nav";
import GlobalFooter from "partials/global-footer";
import ArticleIcon from "components/icons/article";
import UpdateIcon from "components/icons/update";
import useUserProfile from "hooks/useUserProfile";

export default () => {
  const userProfile = useUserProfile();

  return (
    <React.Fragment>
      <div className="bg-high-contrast">
        <GlobalNav />
        <Container className="scaling-header">
          <div className="hdg hdg--2">
            Welcome back, {userProfile.firstName}.
          </div>

          <div className="hdg hdg--3 mt-1">
            Get quick access to your tools below.
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
      <GlobalFooter />
    </React.Fragment>
  );
};
