import React, { useState } from "react";
import "./index.scss";
import { Link } from "react-router-dom";
import Logo from "partials/logo";
import Modal from "components/ui/modal";
import ContactInfo from "partials/contact-info";
import Media from "react-media";

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
          <span className="visually-hidden">Medicare Center</span>
          <Logo aria-hidden="true" />
        </Link>
        <nav className="global-footer__links mt-4">
          <h2 className="visually-hidden">Additional Navigation</h2>
          <ul className="divided-hlist">
            {/*
          Causes console error in dev env only due to this issue
          https://github.com/ReactTraining/react-media/issues/139
        */}
            <Media
              queries={{
                small: "(max-width: 767px)",
              }}
            >
              {(matches) =>
                !matches.small ? (
                  <React.Fragment>
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
                  </React.Fragment>
                ) : null
              }
            </Media>
            <li>
              <a
                href={`${process.env.REACT_APP_PORTAL_URL || ""}/terms`}
                rel="noopener noreferrer"
                className="link link--inherit"
              >
                Terms of Use
              </a>
            </li>
            <li>
              <a
                href={`${process.env.REACT_APP_PORTAL_URL || ""}/privacy`}
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
