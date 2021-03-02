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

const SiteNotification = ({ showPhoneNotification }) => {
  // WORKING ON SITE NOTIFICATION
  // const sitewideNotificationMessage =
  //   process.env.REACT_APP_SITEWIDE_NOTIFICATION;

  // if (sitewideNotificationMessage) {
  //   return (
  //     <div className="site-notification" data-testid="site-notification">
  //       <div className="site-notification__icon">&#9888;</div>
  //       <div>{sitewideNotificationMessage}</div>
  //     </div>
  //   );
  // }

  if (showPhoneNotification) {
    return (
      <div
        className="site-notification site-notification--notice"
        data-testid="phone-number-notification"
      >
        <div className="site-notification__icon">&#9888;</div>
        <div>
          Phone number is required. Please{" "}
          <Link to="/edit-account">update</Link> your account information.
        </div>
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
              component: Link,
              props: {
                to: "/home",
                className: analyticsService.clickClass("home-header"),
              },
              label: "Home",
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
              component: HelpButtonWithModal,
              label: "Need Help?",
              format: "large",
              props: { className: analyticsService.clickClass("help-header") },
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
    auth.isAuthenticated() && !auth.userProfile.phone;

  return (
    <>
      <SiteNotification showPhoneNotification={showPhoneNotification} />
      <header
        className={`global-nav ${className} ${
          showPhoneNotification ? "global-nav--hasNotification" : ""
        }`}
        {...props}
      >
        <a href="#main-content" className="skip-link">
          Jump to main content
        </a>
        <h1 className="global-nav__title">
          <Link to={auth.isAuthenticated() ? "/home" : "/welcome"}>
            <Logo aria-hidden="true" />
            <span className="visually-hidden">Medicare Center</span>
          </Link>
        </h1>
        {auth.isAuthenticated() && !menuHidden && (
          <nav className="global-nav__links">
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
