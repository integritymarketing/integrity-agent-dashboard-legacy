import React, { useContext, useState, useEffect } from "react";
import * as Sentry from "@sentry/react";
import { Link, useHistory } from "react-router-dom";
import AuthContext from "contexts/auth";
import Media from "react-media";
import LargeFormatMenu from "./large-format";
import SmallFormatMenu from "./small-format";
import Logo from "partials/logo";
import MyButton from "./MyButton";
import Modal from "components/ui/modal";
import ContactInfo from "partials/contact-info";
import Logout from "./Logout.svg";
import Account from "./Account.svg";
import NeedHelp from "./Needhelp.svg";
import clientService from "services/clientsService";
import "./index.scss";
import analyticsService from "services/analyticsService";
import useToast from "hooks/useToast";
import GetStarted from "packages/GetStarted";
import InboundCallBanner from "packages/InboundCallBanner";
import authService from "services/authService";
import validationService from "services/validationService";
import useLoading from "hooks/useLoading";
import { welcomeModalOpenAtom } from "recoil/agent/atoms";
import { useSetRecoilState } from "recoil";
import { useAgentAvailability } from "hooks/useAgentAvailability";
import MobileHome from "./assets/icons-Home.svg";
import MobileContacts from "./assets/icons-Contacts.svg";
import MobileLogout from "./assets/icons-Logout.svg";
import MobileAccount from "./assets/icons-Account.svg";

const handleCSGSSO = async (history, loading) => {
  loading.begin(0);

  let user = await authService.getUser();

  const response = await fetch(
    `${process.env.REACT_APP_AUTH_AUTHORITY_URL}/external/csglogin/`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + user.access_token,
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  loading.end();

  if (response.status >= 200 && response.status < 300) {
    let res = await response.json();

    // standardize the API response into a formatted object
    // note that formikErrorsFor is a bit of a mis-nomer, this simply formats the
    // [{"Key":"redirect_url","Value":"url"}] api response
    // as { redirct_url: 'url' } for simplicity
    let formattedRes = validationService.formikErrorsFor(res);
    window.open(formattedRes.redirect_url, "_blank");
    return;
  } else {
    history.replace("/error?code=third_party_notauthorized");
  }
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

export default ({ menuHidden = false, className = "", page, ...props }) => {
  const auth = useContext(AuthContext);
  const addToast = useToast();
  const history = useHistory();
  const loadingHook = useLoading();
  const setWelcomeModalOpen = useSetRecoilState(welcomeModalOpenAtom);
  const [navOpen, setNavOpen] = useState(false);
  const [agentInfo, setAgentInfo] = useState({});
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [user, setUser] = useState({});
  const [isAvailable, setIsAvailable] = useAgentAvailability();
  const [leadPreference, setLeadPreference] = useState({});
  const [loading, setLoading] = useState(true);
  const mobileMenuProps = Object.assign(
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
                to: "/dashboard",
                className: analyticsService.clickClass("dashbaord-header"),
              },
              label: "Dashboard",
              img: MobileHome,
            },
            {
              component: Link,
              props: {
                to: "/contacts",
                className: analyticsService.clickClass("contacts-header"),
              },
              label: "Contacts",
              img: MobileContacts,
            },
            {
              component: Link,
              props: { to: "/account" },
              label: "Account",
              img: MobileAccount,
            },
            {
              component: "button",
              props: {
                type: "button",
                onClick: () => auth.logout(),
              },
              label: "Sign out",
              img: MobileLogout,
            },
          ],
          secondary: [
            {
              component: Link,
              props: {
                to: "/help",
              },
              label: "Need Help?",
              img: NeedHelp,
            },
            {
              component: "button",
              props: {
                type: "button",
                onClick: () => {
                  handleCSGSSO(history, loadingHook);
                },
              },
              label: "CSG App",
            },
            {
              component: "button",
              props: {
                type: "button",
                onClick: () => {
                  window.open(process.env.REACT_APP_SUNFIRE_SSO_URL, "_blank");
                },
              },
              label: "MedicareLink",
            },
            {
              component: "button",
              props: {
                type: "button",
                onClick: () => {
                  window.open(
                    process.env.REACT_APP_AUTH_AUTHORITY_URL +
                      "/external/SamlLogin/2023",
                    "_blank"
                  );
                },
              },
              label: "MedicareAPP",
            },
          ],
        }
      : {
          primary: [],
          secondary: [],
        }
  );

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
                onClick: () =>
                  window.open(
                    `/leadcenter-redirect/${agentInfo?.agentNPN}`,
                    "_blank"
                  ),
              },
              label: "LeadCENTER",
            },
            {
              component: "button",
              props: {
                type: "button",
                onClick: () => {
                  window.open(
                    process.env.REACT_APP_AUTH_AUTHORITY_URL +
                      "/external/SamlLogin/2023",
                    "_blank"
                  );
                },
              },
              label: "MedicareAPP",
            },
            {
              component: "button",
              props: {
                type: "button",
                onClick: () => {
                  window.open(process.env.REACT_APP_SUNFIRE_SSO_URL, "_blank");
                },
              },
              label: "MedicareLINK",
            },
            {
              component: "button",
              props: {
                type: "button",
                onClick: () => {
                  handleCSGSSO(history, loadingHook);
                },
              },
              label: "CSG APP",
            },
            {
              component: Link,
              props: {
                to: "/help",
              },
              label: "Need Help?",
              img: NeedHelp,
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
    const isDashboardLocation = history?.location?.pathname === "/dashboard";
    if (!agentid) {
      return;
    }
    try {
      setLoading(true);
      const response = await clientService.getAgentAvailability(agentid);
      const { isAvailable, agentVirtualPhoneNumber, leadPreference } =
        response || {};
      if (!agentVirtualPhoneNumber && isDashboardLocation) {
        setTimeout(() => clientService.genarateAgentTwiloNumber(agentid), 5000);
      }
      if (!leadPreference?.isAgentMobilePopUpDismissed) {
        setWelcomeModalOpen(true);
      }
      setAgentInfo(response);
      setIsAvailable(isAvailable);
      setLeadPreference(leadPreference);
    } catch (error) {
      Sentry.captureException(error);
    } finally {
      setLoading(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  let showPhoneNotification = false;

  if (!loading && auth.isAuthenticated() && user && !user.phone) {
    showPhoneNotification = true;
  }
  const { agentid = "" } = user || {};
  function clickButton() {
    updateAgentAvailability({ agentID: agentid, availability: !isAvailable });
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

  let showBanner = false;
  if (
    !loading &&
    agentInfo &&
    agentInfo.leadPreference &&
    !agentInfo.leadPreference.isAgentMobileBannerDismissed
  ) {
    showBanner = true;
  }
  return (
    <>
      <SiteNotification
        showPhoneNotification={showPhoneNotification}
        showMaintenaceNotification={showMaintenaceNotification}
      />
      {showBanner && <GetStarted leadPreference={leadPreference} />}
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
          <Link to={auth.isAuthenticated() ? "/dashboard" : "/welcome"}>
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
                  {matches.small && <SmallFormatMenu {...mobileMenuProps} />}
                  {!matches.small && <LargeFormatMenu {...menuProps} />}
                  {leadPreference && (
                    <MyButton
                      leadPreference={leadPreference}
                      clickButton={clickButton}
                      isAvailable={isAvailable}
                      page={page}
                      hasActiveCampaign={agentInfo?.hasActiveCampaign}
                    />
                  )}
                </React.Fragment>
              )}
            </Media>
          </nav>
        )}
      </header>
      {auth.isAuthenticated() && !menuHidden && (
        <InboundCallBanner agentInformation={agentInfo} />
      )}
      <Modal
        open={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        labeledById="dialog_help_label"
        descById="dialog_help_desc"
        testId={"header-support-modal"}
      >
        <ContactInfo testId={"header-support-modal"} />
      </Modal>
    </>
  );
};
