import React, { useState } from "react";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav";
import GlobalFooter from "partials/global-footer";
import ResourceLinkGrid from "partials/resource-link-grid";
import ContactInfo from "partials/contact-info";
import Modal from "components/ui/modal";

const SSOButtonWithModal = ({ ...props }) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <React.Fragment>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        {...props}
      ></button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="mb-3">
          <div className="tool-icon">MA</div>
        </div>
        <p className="text-body mb-4">
          Choose your <br />
          <strong>Medicare Advantage/PDP</strong> experience:
        </p>
        <div className="pt-2 mb-3">
          <button className="btn">Open Connecture</button>
        </div>
        <div className="mb-4">
          <button className="btn">Open SunFireMatrix</button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

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
                <SSOButtonWithModal className="btn btn--invert">
                  Open
                </SSOButtonWithModal>
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
      <Container className="mt-scale-3 mb-4">
        <section>
          <div className="hdg hdg--1">Learning Center</div>
          <p className="text-body text-muted mt-1 mb-4">
            Explore resources designed to help you meet client needs and grow
            your business.
          </p>
          <ResourceLinkGrid />
        </section>
      </Container>
      <GlobalFooter />
    </React.Fragment>
  );
};
