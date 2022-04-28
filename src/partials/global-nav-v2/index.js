import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "contexts/auth";
import Media from "react-media";
import LargeFormatMenu from "./large-format";
import SmallFormatMenu from "./small-format";
import Logo from "partials/logo";
import Modal from "components/ui/modal";
import ContactInfo from "partials/contact-info";
import "./index.scss";
import analyticsService from "services/analyticsService";

const useHelpButtonWithModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const testId = "header-support-modal";

  return [
    ({ ...props }) => (
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        {...props}
      ></button>
    ),
    () => (
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        labeledById="dialog_help_label"
        descById="dialog_help_desc"
        testId={testId}
      >
        <ContactInfo testId={testId} />
      </Modal>
    ),
  ];
};

const SiteNotification = ({
  showPhoneNotification,
  showMaintenaceNotification,
}) => {
  const notificationClass = [
    "site-notification2-",
    showPhoneNotification ? "hasNotification" : null,
    showMaintenaceNotification ? "hasMainitananceNotification" : null,
  ]
    .filter(Boolean)
    .join("-");

  if (showPhoneNotification || showMaintenaceNotification) {
    return (
      <div
        className={`site-notification2 site-notification2--notice ${notificationClass}`}
      >
        {showPhoneNotification && (
          <div data-testid="phone-number-notification">
            <div className="site-notification2__icon">&#9888;</div>
            <div>
              Phone number is required. Please{" "}
              <Link to="/edit-account">update</Link> your account information.
            </div>
          </div>
        )}
        {showMaintenaceNotification && (
          <div
            className="site-notification2__maintanance"
            data-testid="maintance-notification"
          >
            <div>We are currently experiencing issues</div>
            <div className="site-maintanance-text">
              This may affect your ability to use MedicareCENTER. We are working
              as fast as we can to resolve the issue.
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default ({ menuHidden = false, className = "", ...props }) => {
  const auth = useContext(AuthContext);
  const [navOpen, setNavOpen] = useState(false);
  const [HelpButtonWithModal, HelpButtonModal] = useHelpButtonWithModal();

  const menuProps = Object.assign(
    {
      navOpen,
      setNavOpen,
    },
    auth.isAuthenticated() && !menuHidden
      ? {
          primary: [
            {
              component: HelpButtonWithModal,
              label: "Need Help?",
              format: "large",
              props: { className: analyticsService.clickClass("help-header") },
            },
            {
              component: Link,
              props: {
                to: "/dashboard",
                className: analyticsService.clickClass("dashbaord-header"),
              },
              label: "Dashboard",
            },
            {
              component: Link,
              props: {
                to: "/contacts",
                className: analyticsService.clickClass("contacts-header"),
              },
              label: "Contacts",
            },
            {
              component: Link,
              props: {
                to: "/learning-center",
                className: analyticsService.clickClass("learningcenter-header"),
              },
              label: "Learning Center",
            },
          ],
          secondary: [
            {
              component: Link,
              props: { to: "/edit-account" },
              label: "Edit Account",
            },
            {
              component: "button",
              props: {
                type: "button",
                onClick: () => auth.logout(),
              },
              label: "Logout",
            },
          ],
        }
      : {
          primary: [],
          secondary: [],
        }
  );

  const showPhoneNotification =
    auth.isAuthenticated() && auth.userProfile.phone === null;
  const showMaintenaceNotification =
    process.env.REACT_APP_NOTIFICATION_BANNER === "true";
  const headernotificationClass = [
    "global-nav-v2-",
    showPhoneNotification ? "hasNotification" : null,
    showMaintenaceNotification ? "hasMainitananceNotification" : null,
  ]
    .filter(Boolean)
    .join("-");

  return (
    <>
      <SiteNotification
        showPhoneNotification={showPhoneNotification}
        showMaintenaceNotification={showMaintenaceNotification}
      />
      <header
        className={`global-nav-v2 ${analyticsService.clickClass(
          "nav-wrapper"
        )} ${className} ${headernotificationClass}`}
        {...props}
      >
        <a href="#main-content" className="skip-link">
          Jump to main content
        </a>
        <h1
          className={`global-nav-v2__title ${analyticsService.clickClass(
            "nav-logo"
          )}`}
        >
          <Link to={auth.isAuthenticated() ? "/home" : "/welcome"}>
            <Logo aria-hidden="true" />
            <span className="visually-hidden">Medicare Center</span>
          </Link>
        </h1>
        {auth.isAuthenticated() && !menuHidden && (
          <nav className="global-nav-v2__links">
            <h2 className="visually-hidden">Main Navigation</h2>
            {/*
          Causes console error in dev env only due to this issue
          https://github.com/ReactTraining/react-media/issues/139
        */}
            <Media
              queries={{
                small: "(max-width: 767px)",
              }}
            >
              {(matches) => (
                <React.Fragment>
                  {matches.small && <SmallFormatMenu {...menuProps} />}
                  {!matches.small && <LargeFormatMenu {...menuProps} />}
                </React.Fragment>
              )}
            </Media>
          </nav>
        )}
        <HelpButtonModal />
      </header>
    </>
  );
};
