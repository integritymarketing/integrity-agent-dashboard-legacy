import React, { useState } from "react";
import "./index.scss";
import { Link } from "react-router-dom";
import Logo from "partials/logo";
import Modal from "components/ui/modal";
import ContactInfo from "partials/contact-info";
import Media from "react-media";
import analyticsService from "services/analyticsService";
import usePortalUrl from "hooks/usePortalUrl";

const HelpButtonWithModal = ({ ...props }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const testId = "footer-support-modal";
  return (
    <React.Fragment>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        {...props}
      ></button>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        labeledById="dialog_help_label"
        descById="dialog_help_desc"
        testId={testId}
      >
        <ContactInfo testId={testId} />
      </Modal>
    </React.Fragment>
  );
};

export default ({ className = "", hideMedicareIcon, ...props }) => {
  const portalUrl = usePortalUrl();
  const hideMedicareTag = !hideMedicareIcon;
  return (
    <footer
      className={`global-footer text-muted pt-5 ${className}`}
      data-gtm="footer-wrapper"
      {...props}
    >
      <div className="global-footer__content sf-text-center">
        {hideMedicareTag && (
          <Link to="/">
            <span className="visually-hidden">Medicare Center</span>
            <Logo aria-hidden="true" id='footerLogo' />
          </Link>
        )}
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
                      <HelpButtonWithModal
                        className={`link link--inherit ${analyticsService.clickClass(
                          "help-footer"
                        )}`}
                      >
                        Need Help?
                      </HelpButtonWithModal>
                    </li>
                    <li>
                      <Link
                        to="/learning-center"
                        className={`link link--inherit ${analyticsService.clickClass(
                          "learningcenter-footer"
                        )}`}
                      >
                        Learning Center
                      </Link>
                    </li>
                  </React.Fragment>
                ) : null
              }
            </Media>
            <li>
              <a
                href={`${portalUrl || ""}/terms`}
                rel="noopener noreferrer"
                className="link link--inherit"
              >
                Terms of Use
              </a>
            </li>
            <li>
              <a
                href={`${portalUrl || ""}/privacy`}
                rel="noopener noreferrer"
                className="link link--inherit"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </nav>
        <small className="global-footer__legal mt-4">
          <span>&copy; {new Date().getFullYear()}</span>{" "}
          <span>Integrity Marketing Group.</span>{" "}
          <span>All rights reserved.</span>
        </small>
      </div>
    </footer>
  );
};
