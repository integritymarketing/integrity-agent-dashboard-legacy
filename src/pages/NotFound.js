import React, { useState } from "react";
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
  return (
    <div className="content-frame bg-brand-gradient text-invert">
      <GlobalNav color="invert" menuHidden={true} />
      <Container className="mt-scale-3">
        <div className="hdg hdg--2 mb-3">404</div>
        <div className="hdg hdg--1 mb-2">Well this is awkward.</div>
        <p className="text-body text-body--large mb-4">
          We weren’t able to find anything here. <br />
          Please check the URL or <HelpLink>contact support</HelpLink> for
          further assistance.
        </p>
        <div className="pt-2">
          <button className="btn btn--invert">Go Back</button>
        </div>
        <HelpModal />
      </Container>
      <GlobalFooter className="global-footer--simple" />
    </div>
  );
};
