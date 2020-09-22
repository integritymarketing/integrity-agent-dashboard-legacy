import React, { useState } from "react";
import { Link } from "react-router-dom";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav";
import SimpleFooter from "partials/simple-footer";
import Modal from "components/ui/modal";
import ContactInfo from "partials/contact-info";
import useParams from "hooks/useParams";

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

const getMessageForCode = (code) => {
  switch (code) {
    case "third_party_notauthorized":
      return "We were unable to connect you to this service over SSO.";
    default:
      return "But something went wrong";
  }
};

export default () => {
  const [HelpLink, HelpModal] = useHelpLinkWithModal();
  const params = useParams();
  const errorMessage = getMessageForCode(params.get("code"));

  return (
    <div className="content-frame bg-neutral-gradient text-invert">
      <GlobalNav menuHidden={true} className="mb-auto" />
      <Container>
        <div className="hdg hdg--2">Sorry</div>

        <p className="text-body text-body--large mb-4">
          {errorMessage}
          <br />
          Please <HelpLink>contact support</HelpLink> for further assistance.
        </p>

        <div>
          <Link className="btn btn--invert" to="/home">
            Go To Dashboard
          </Link>
        </div>
        <HelpModal />
      </Container>
      <SimpleFooter className="global-footer--simple" />
    </div>
  );
};
