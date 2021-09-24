import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory } from "react-router-dom";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav";
import GlobalFooter from "partials/global-footer";
import EnrollClientBanner from "partials/enroll-clients-banner";
import ResourceLinkGrid from "partials/resource-link-grid";
import analyticsService from "services/analyticsService";
import validationService from "services/validationService";
import authService from "services/authService";
import useLoading from "hooks/useLoading";

const handleCSGSSO = async (history, loading) => {
  loading.begin(0);

  let user = await authService.getUser();

  const response = await fetch(
    `${process.env.REACT_APP_AUTH_AUTHORITY_URL}/external/csglogin/`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + user.access_token,
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  loading.end();

  if (response.status >= 200 && response.status < 300) {
    let res = await response.json();

    // standardize the API response into a formatted object
    // note that formikErrorsFor is a bit of a mis-nomer, this simply formats the
    // [{"Key":"redirect_url","Value":"url"}] api response
    // as { redirct_url: 'url' } for simplicity
    let formattedRes = validationService.formikErrorsFor(res);
    window.open(formattedRes.redirect_url, "_blank");
    return;
  } else {
    history.replace("/error?code=third_party_notauthorized");
  }
};

export default () => {
  const history = useHistory();
  const loading = useLoading();

  useEffect(() => {
    analyticsService.fireEvent("event-content-load", {
      pagePath: "/portal-home-page/",
    });
  }, []);

  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Home</title>
      </Helmet>
      <div className="bg-photo logged-in text-invert">
        <GlobalNav />
        <Container
          id="main-content"
          data-gtm="hp-category-wrapper"
          className="scaling-header"
        >
          <div className="mod-grid">
            <div
              className="mod text-center"
              data-gtm="hp-category-wrapper-item"
            >
              <div className="box-content">
                <div className="pb-1">
                  <div className="tool-icon">MED APP</div>
                </div>
                <div className="mt-1 text-color body">
                  <p className="text-body">
                    Quote and enroll PDP clients into the right plan with ease
                  </p>
                </div>
                <div className="pt-2 mt-auto">
                  <div className="button-wrapper">
                    <button
                      data-gtm="hp-category-wrapper-item-button"
                      type="button"
                      onClick={() => {
                        window.open(
                          process.env.REACT_APP_AUTH_AUTHORITY_URL +
                            "/external/SamlLogin/2022",
                          "_blank"
                        );
                      }}
                      className={`btn--invert cta-button ${analyticsService.clickClass(
                        "medicaresupplement-button"
                      )}`}
                    >
                      2022 MedicareAPP
                    </button>
                  </div>
                </div>
                <div className="pt-2 mt-auto">
                  <a
                    href={
                      process.env.REACT_APP_AUTH_AUTHORITY_URL +
                      "/external/SamlLogin/2021"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${analyticsService.clickClass(
                      "connecture-button"
                    )}`}
                  >
                    2021 MedicareAPP
                  </a>
                </div>
              </div>
            </div>
            <div
              className="mod text-center"
              data-gtm="hp-category-wrapper-item"
            >
              <div className="box-content">
                <div className="pb-1">
                  <div className="tool-icon">MED LINK</div>
                </div>
                <div className="mt-1 text-color body">
                  <p className="text-body">
                    Quote and enroll Medicare Advantage into the right plan
                    quickly and easily
                  </p>
                </div>
                <div className="pt-2 mt-auto">
                  <div className="button-wrapper">
                    <button
                      data-gtm="hp-category-wrapper-item-button"
                      type="button"
                      onClick={() => {
                        window.open(
                          process.env.REACT_APP_SUNFIRE_SSO_URL,
                          "_blank"
                        );
                      }}
                      className={`btn--invert cta-button ${analyticsService.clickClass(
                        "medicaresupplement-button"
                      )}`}
                    >
                      MedicareLINK
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="mod text-center"
              data-gtm="hp-category-wrapper-item"
            >
              <div className="box-content">
                <div className="pb-1">
                  <div className="tool-icon">MED SUPP</div>
                </div>
                <div className="mt-1 text-color body">
                  <p className="text-body">
                    Quote, compare, and research plans by location, carrier,
                    features, or product
                  </p>
                </div>
                <div className="pt-2 mt-auto">
                  <div className="button-wrapper">
                    <button
                      data-gtm="hp-category-wrapper-item-button"
                      type="button"
                      onClick={() => {
                        handleCSGSSO(history, loading);
                      }}
                      className={`btn--invert cta-button ${analyticsService.clickClass(
                        "medicaresupplement-button"
                      )}`}
                    >
                      Medicare Supplement
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <EnrollClientBanner />
      {/*       <FeedbackRibbon />
       */}
      <Container className="mb-4" data-gtm="hp-learning-center-container">
        <section>
          <div className="custom-homepage-heading hdg hdg--1">
            Learning Center
          </div>
          <p className="custom-homepage-headingtext text-body text-muted mt-1 mb-4">
            Explore resources designed to help you meet client needs and grow
            your business
          </p>
          <ResourceLinkGrid />
        </section>
      </Container>
      <GlobalFooter />
    </React.Fragment>
  );
};
