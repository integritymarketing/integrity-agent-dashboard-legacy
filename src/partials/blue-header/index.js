import React, { useState } from "react";
import Modal from "packages/Modal";
import ContactInfo from "partials/contact-info";
import Logo from "./image.svg";
import "./index.scss";

export default () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <header className="header-unauthenticated">
      <Modal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        content={<ContactInfo />}
      />
      <img className="logo" src={Logo} alt="Medicare Center" />
      <div className="need-help" onClick={() => setModalOpen(true)}>
        Need Help?
      </div>
    </header>
  );
};
