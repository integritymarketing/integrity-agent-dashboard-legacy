import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav";
import GlobalFooter from "partials/global-footer";
import Modal from "components/ui/modal";
import ContactInfo from "partials/contact-info";

const useHelpLinkWithModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return [
    (props) => (
      <button
        className="link link--inherit link--body"
        type="button"
        onClick={() => setModalOpen(true)}
        {...props}
      ></button>
    ),
    () => (
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <ContactInfo />
      </Modal>
    ),
  ];
};

export default () => {
  const [HelpLink, HelpModal] = useHelpLinkWithModal();
  const history = useHistory();
  return (
    <div className="content-frame bg-neutral-gradient text-invert">
      <GlobalNav color="invert" menuHidden={true} className="mb-auto" />
      <Container>
        <div className="hdg hdg--2">404</div>
        <div className="hdg hdg--2 mb-4">Page not found.</div>
        <p className="text-body text-body--large mb-4">
          We weren’t able to find the page you are looking for. <br />
          Please check the URL or <HelpLink>contact support</HelpLink> for
          further assistance.
        </p>
        <div>
          <button className="btn btn--invert" onClick={() => history.goBack()}>
            Go Back
          </button>
        </div>
        <HelpModal />
      </Container>
      <GlobalFooter className="global-footer--simple" />
    </div>
  );
};
