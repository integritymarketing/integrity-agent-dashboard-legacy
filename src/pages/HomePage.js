import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useHistory } from "react-router-dom";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav";
import GlobalFooter from "partials/global-footer";
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
  return (
    <React.Fragment>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        {...props}
      ></button>
      <Modal wide open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="mb-3">
          <div className="tool-icon">MA PDP</div>
        </div>
        <p className="text-body text-body--large pb-3 border-bottom mb-3">
          Choose from two amazing enrollment tool options:
        </p>
        <div className="pt-2 mb-2">
          <p className="text-body text-body--large">
            Access previous MedicareCENTER features and more, or access{" "}
            <a
              href="https://integrity-ppc.destinationrx.com/PlanCompare/2020/professional/type1/Compare/Home"
              target="_blank"
              rel="noopener noreferrer"
              className="link link--force-underline"
            >
              MedicareCENTER 2020
            </a>
            .
          </p>
        </div>
        <div className="mb-4 text-body">
          <a
            href={
              process.env.REACT_APP_AUTH_AUTHORITY_URL + "/external/SamlLogin"
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
        <div className="text-body">
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

  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Home</title>
      </Helmet>
      <div className="bg-photo text-invert">
        <GlobalNav />
        <Container className="scaling-header">
          <div className="mod-grid">
            <div className="mod text-center">
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
                <SSOButtonWithModal
                  className={`btn btn--invert ${analyticsService.clickClass(
                    "medicareadvantage-button"
                  )}`}
                >
                  Medicare Advantage & PDP
                </SSOButtonWithModal>
              </div>
            </div>

            <div className="mod text-center">
              <div className="pb-1">
                <div className="tool-icon">MED SUPP</div>
              </div>
              <div className="mt-1">
                <p className="text-body">
                  Quote and compare Med Supp plans by location, carrier, and
                  more
                </p>
              </div>
              <div className="pt-2 mt-auto">
                <button
                  type="button"
                  onClick={() => {
                    handleCSGSSO(history, loading);
                  }}
                  className={`btn btn--invert ${analyticsService.clickClass(
                    "medicaresupplement-button"
                  )}`}
                >
                  Medicare Supplement
                </button>
              </div>
            </div>

            <div className="mod text-center">
              <div className="pb-1">
                <div className="tool-icon">CRM</div>
              </div>
              <div className="mt-1">
                <p className="text-body">
                  Manage client information and relationships
                </p>
              </div>
              <div className="pt-2 mt-auto">
                <Link
                  to="/clients"
                  className={`btn btn--invert ${analyticsService.clickClass(
                    "crm-button"
                  )}`}
                >
                  Client Management
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Container className="mt-scale-3 mb-4">
        <section>
          <div className="hdg hdg--1">Learning Center</div>
          <p className="text-body text-muted mt-1 mb-4">
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
