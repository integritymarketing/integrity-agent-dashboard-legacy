import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useHistory } from "react-router-dom";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav";
import GlobalFooter from "partials/global-footer";
import FeedbackRibbon from "partials/feedback-ribbon";
import ResourceLinkGrid from "partials/resource-link-grid";
import Modal from "components/ui/modal";
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

const SSOButtonWithModal = ({ ...props }) => {
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    if (modalOpen) {
      analyticsService.fireEvent("event-modal-appear", {
        modalName: "Enrollment Option Modal",
      });
    }
  }, [modalOpen]);
  return (
    <React.Fragment>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        {...props}
      ></button>
      <Modal
        wide
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        labeledById="dialog_sso_label"
        descById="dialog_sso_desc"
      >
        <div className="mb-3">
          <div className="tool-icon" id="dialog_sso_label">
            MA PDP
          </div>
        </div>
        <p
          className="text-body text-body--large pb-3 border-bottom mb-3"
          id="dialog_sso_desc"
        >
          Choose from two amazing enrollment tool options:
        </p>
        <div className="pt-2 mb-2">
          <p className="text-body text-body--large">
            Access MedicareCENTER with an enhanced interface offering texting,
            document storage capabilities, and more!
          </p>
        </div>
        <div
          className="mb-4 text-body"
          data-gtm="enrollment-option-modal-medicareapp-button"
        >
          <a
            href={
              process.env.REACT_APP_AUTH_AUTHORITY_URL +
              "/external/SamlLogin/2021"
            }
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn--no-upper ${analyticsService.clickClass(
              "connecture-button"
            )}`}
          >
            MedicareAPP
          </a>
        </div>
        <div className="mb-3">
          <p className="text-body text-body--large text-bold text-hr text-hr--dark text-hr--short">
            OR
          </p>
        </div>
        <div className="pt-1 mb-2">
          <p className="text-body text-body--large">
            Access a new enrollment tool option that offers texting capabilities
            and more!
          </p>
        </div>
        <div
          className="text-body"
          data-gtm="enrollment-option-modal-medicare-link"
        >
          <a
            href={process.env.REACT_APP_SUNFIRE_SSO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn--no-upper ${analyticsService.clickClass(
              "sunfire-button"
            )}`}
          >
            MedicareLINK
          </a>
        </div>
      </Modal>
    </React.Fragment>
  );
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
              <div className="pb-1">
                <div className="tool-icon">MA PDP</div>
              </div>
              <div className="mt-1">
                <p className="text-body">
                  Quote and enroll Medicare Advantage and PDP clients into the
                  right plan quickly and easily
                </p>
              </div>
              <div className="pt-2 mt-auto">
                <div className="button-wrapper">
                  <SSOButtonWithModal
                    data-gtm="hp-category-wrapper-item-button"
                    className={`btn--invert cta-button ${analyticsService.clickClass(
                      "medicareadvantage-button"
                    )}`}
                  >
                    Medicare Advantage & PDP
                  </SSOButtonWithModal>
                </div>
              </div>
            </div>

            <div
              className="mod text-center"
              data-gtm="hp-category-wrapper-item"
            >
              <div className="pb-1">
                <div className="tool-icon">MED SUPP</div>
              </div>
              <div className="mt-1">
                <p className="text-body">
                  Quote, compare, and research Med Supp plans and more by
                  location, carrier, features, or product
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

            <div
              className="mod text-center"
              data-gtm="hp-category-wrapper-item"
            >
              <div className="pb-1">
                <div className="tool-icon">CRM</div>
              </div>
              <div className="mt-1">
                <p className="text-body">
                  Manage client information and relationships
                </p>
              </div>
              <div className="pt-2 mt-auto">
                <div className="button-wrapper">
                  <Link
                    data-gtm="hp-category-wrapper-item-button"
                    to="/contacts"
                    className={`btn--invert cta-button ${analyticsService.clickClass(
                      "crm-button"
                    )}`}
                  >
                    Client Management
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <FeedbackRibbon />
      <Container
        className="mt-scale-3 mb-4"
        data-gtm="hp-learning-center-container"
      >
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
