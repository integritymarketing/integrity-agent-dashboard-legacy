import React, { useState } from "react";
import "./index.scss";
import { Link } from "react-router-dom";
import Logo from "partials/logo";
import Modal from "components/ui/modal";
import ContactInfo from "partials/contact-info";

const HelpButtonWithModal = ({ ...props }) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <React.Fragment>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        {...props}
      ></button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <ContactInfo />
      </Modal>
    </React.Fragment>
  );
};

export default ({ className = "", ...props }) => {
  return (
    <footer className={`global-footer text-muted pt-5 ${className}`} {...props}>
      <div className="global-footer__content sf-text-center">
        <Link to="/">
          <Logo />
        </Link>
        <nav className="global-footer__links mt-4">
          <h2 className="visually-hidden">Additional Navigation</h2>
          <ul className="divided-hlist">
            <li>
              <HelpButtonWithModal className="link link--inherit">
                Need Help?
              </HelpButtonWithModal>
            </li>
            <li>
              <Link to="/resources" className="link link--inherit">
                Learning Center
              </Link>
            </li>
            <li>
              <a
                href={`${process.env.REACT_APP_PORTAL_URL || ""}/terms`}
                target="_blank"
                rel="noopener noreferrer"
                className="link link--inherit"
              >
                Terms of Use
              </a>
            </li>
            <li>
              <a
                href={`${process.env.REACT_APP_PORTAL_URL || ""}/privacy`}
                target="_blank"
                rel="noopener noreferrer"
                className="link link--inherit"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </nav>
        <small className="global-footer__legal mt-4">
          <span>Copyright © 2020</span> <span>Integrity Marketing Group.</span>{" "}
          <span>All rights reserved.</span>
        </small>
      </div>
    </footer>
  );
};
