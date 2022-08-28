import React, { useContext, useState, useEffect } from "react";
import * as Sentry from "@sentry/react";
import { Link } from "react-router-dom";
import AuthContext from "contexts/auth";
import Media from "react-media";
import LargeFormatMenu from "./large-format";
import SmallFormatMenu from "./small-format";
import Logo from "partials/logo";
import MyButton from "./MyButton";
import MyModal from "./MyModal";
import Modal from "components/ui/modal";
import ContactInfo from "partials/contact-info";
import Logout from "./Logout.svg";
import Account from "./Account.svg";
import clientService from "services/clientsService";
import { formatPhoneNumber } from "utils";
import "./index.scss";
import analyticsService from "services/analyticsService";
import useToast from "hooks/useToast";
import GetStarted from "packages/GetStarted";
import InboundCallBanner from "packages/InboundCallBanner";

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
  const addToast = useToast();
  const [navOpen, setNavOpen] = useState(false);
  const [agentInfo, setAgentInfo] = useState({});
  const [HelpButtonWithModal, HelpButtonModal] = useHelpButtonWithModal();
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [phone, setPhone] = useState("");
  const [virtualNumber, setVirtualNumber] = useState("");
  const [callForwardNumber, setCallForwardNumber] = useState("");
  const [leadPreference, setLeadPreference] = useState({});
  const [loading, setLoading] = useState(true);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

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
              props: { to: "/account" },
              label: "Account",
              img: Account,
            },
            {
              component: "button",
              props: {
                type: "button",
                onClick: () => auth.logout(),
              },
              label: "Sign Out",
              img: Logout,
            },
          ],
        }
      : {
          primary: [],
          secondary: [],
        }
  );

  const getAgentAvailability = async (agentid) => {
    if (!agentid) {
      return;
    }
    try {
      setLoading(true);
      const response = await clientService.getAgentAvailability(agentid);
      const {
        isAvailable,
        phone,
        agentVirtualPhoneNumber,
        callForwardNumber,
        leadPreference,
      } = response || {};
      setAgentInfo(response);
      setIsAvailable(isAvailable);
      setPhone(formatPhoneNumber(phone, true));
      setLeadPreference(leadPreference);
      if (agentVirtualPhoneNumber) {
        setVirtualNumber(formatPhoneNumber(agentVirtualPhoneNumber, true));
      }
      if (callForwardNumber) {
        setCallForwardNumber(callForwardNumber);
      }
    } catch (error) {
      Sentry.captureException(error);
    } finally {
      setLoading(false)
    }
  };

  const updateAgentAvailability = async (data) => {
    try {
      let response = await clientService.updateAgentAvailability(data);
      if (response.ok) {
        getAgentAvailability(data.agentID);
      }
    } catch (error) {
      addToast({
        type: "error",
        message: "Failed to Save the Availability.",
        time: 10000,
      });
      Sentry.captureException(error);
    }
  };

  const updateAgentPreferences = async (data) => {
    try {
      await clientService.updateAgentPreferences(data);
    } catch (error) {
      addToast({
        type: "error",
        message: "Failed to Save the Preferences.",
        time: 10000,
      });
      Sentry.captureException(error);
    }
  };

  useEffect(() => {
    const loadAsyncData = async () => {
      const user = await auth.getUser();
      const { agentid } = user.profile;
      getAgentAvailability(agentid);
      setUser(user.profile);
    };
    if (auth.isAuthenticated()) {
      loadAsyncData();
    }
  }, [auth]);

  const showPhoneNotification = auth.isAuthenticated() && !user?.phone;
  function clickButton() {
    handleOpen();
  }

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
      {!loading && !agentInfo?.leadPreference?.isAgentMobilePopUpDismissed && <GetStarted />}
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
                  <MyButton
                    clickButton={clickButton}
                    isAvailable={isAvailable}
                  ></MyButton>
                </React.Fragment>
              )}
            </Media>
          </nav>
        )}
        <HelpButtonModal />
        <MyModal
          phone={phone}
          virtualNumber={virtualNumber}
          user={user}
          handleOpen={handleOpen}
          handleClose={handleClose}
          open={open}
          isAvailable={isAvailable}
          updateAgentAvailability={updateAgentAvailability}
          updateAgentPreferences={updateAgentPreferences}
          callForwardNumber={callForwardNumber}
          leadPreference={leadPreference}
          getAgentAvailability={getAgentAvailability}
        />
      </header>
      <InboundCallBanner agentInformation={agentInfo} />
    </>
  );
};
