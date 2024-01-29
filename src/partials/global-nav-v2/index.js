import * as Sentry from "@sentry/react";
import React, { useContext, useEffect, useState } from "react";
import Media from "react-media";
import { Link, useNavigate } from "react-router-dom";

import { useSetRecoilState } from "recoil";
import { welcomeModalOpenAtom } from "recoil/agent/atoms";

import { useAgentAvailability } from "hooks/useAgentAvailability";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import useLoading from "hooks/useLoading";
import useToast from "hooks/useToast";
import useUserProfile from "hooks/useUserProfile";

import GetStarted from "packages/GetStarted";
import InboundCallBanner from "packages/InboundCallBanner";

import IntegrityLogo from "components/HeaderWithLogin/Integrity-logo";
import Modal from "components/ui/modal";

import ContactInfo from "partials/contact-info";

import AuthContext from "contexts/auth";

import analyticsService from "services/analyticsService";
import authService from "services/authService";
import clientService from "services/clientsService";
import validationService from "services/validationService";

import Account from "./Account.svg";
import Logout from "./Logout.svg";
import MyButton from "./MyButton";
import NeedHelp from "./Needhelp.svg";
import MobileAccount from "./assets/icons-Account.svg";
import MobileContacts from "./assets/icons-Contacts.svg";
import MobileHome from "./assets/icons-Home.svg";
import MobileLogout from "./assets/icons-Logout.svg";
import "./index.scss";
import LargeFormatMenu from "./large-format";
import SmallFormatMenu from "./small-format";

import NewBackBtn from "images/new-back-btn.svg";

const handleCSGSSO = async (navigate, loading) => {
    loading.begin(0);

    const user = await authService.getUser();

    const response = await fetch(`${process.env.REACT_APP_AUTH_AUTHORITY_URL}/external/csglogin/`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${user.access_token}`,
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    loading.end();

    if (response.status >= 200 && response.status < 300) {
        const res = await response.json();

        // standardize the API response into a formatted object
        // note that formikErrorsFor is a bit of a mis-nomer, this simply formats the
        // [{"Key":"redirect_url","Value":"url"}] api response
        // as { redirct_url: 'url' } for simplicity
        const formattedRes = validationService.formikErrorsFor(res);
        window.open(formattedRes.redirect_url, "_blank");
    } else {
        navigate("/error?code=third_party_notauthorized", { replace: true });
    }
};

const SiteNotification = ({ showPhoneNotification, showMaintenaceNotification }) => {
    const notificationClass = [
        "site-notification2-",
        showPhoneNotification ? "hasNotification" : null,
        showMaintenaceNotification ? "hasMainitananceNotification" : null,
    ]
        .filter(Boolean)
        .join("-");

    if (showPhoneNotification || showMaintenaceNotification) {
        return (
            <div className={`site-notification2 site-notification2--notice ${notificationClass}`}>
                {showPhoneNotification && (
                    <div data-testid="phone-number-notification">
                        <div className="site-notification2__icon">&#9888;</div>
                        <div>
                            Phone number is required. Please <Link to="/edit-account">update</Link> your account
                            information.
                        </div>
                    </div>
                )}
                {showMaintenaceNotification && (
                    <div className="site-notification2__maintanance" data-testid="maintance-notification">
                        <div>We are currently experiencing issues</div>
                        <div className="site-maintanance-text">
                            This may affect your ability to use Integrity. We are working as fast as we can to resolve
                            the issue.
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return null;
};

// eslint-disable-next-line max-lines-per-function
const GlobalNavV2 = ({ menuHidden = false, className = "", page, title, ...props }) => {
    const auth = useContext(AuthContext);
    const showToast = useToast();
    const navigate = useNavigate();
    const loadingHook = useLoading();
    const setWelcomeModalOpen = useSetRecoilState(welcomeModalOpenAtom);
    const [navOpen, setNavOpen] = useState(false);
    const [helpModalOpen, setHelpModalOpen] = useState(false);
    const [learnMoreModal, setLearnMoreModal] = useState(false);
    const user = useUserProfile();
    const [, setIsAvailable] = useAgentAvailability();

    const { agentInformation, getAgentAvailability } = useAgentInformationByID();
    const leadPreference = agentInformation?.leadPreference;
    useEffect(() => setIsAvailable(agentInformation?.isAvailable), [setIsAvailable, agentInformation?.isAvailable]);

    const mobileMenuProps = {
        navOpen,
        setNavOpen,
        ...(auth.isAuthenticated() && !menuHidden
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
                                  handleCSGSSO(navigate, loadingHook);
                              },
                          },
                          label: "CSG App",
                      },
                  ],
                  tertiary: [
                      {
                          component: "button",
                          props: {
                              type: "button",
                              onClick: () => auth.logout(),
                          },
                          label: "Sign Out",
                          img: MobileLogout,
                      },
                  ],
              }
            : {
                  primary: [],
                  secondary: [],
                  tertiary: [],
              }),
    };

    const menuProps = {
        navOpen,
        setNavOpen,
        ...(auth.isAuthenticated() && !menuHidden
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
                                  window.open(`/leadcenter-redirect/${agentInformation?.agentNPN}`, "_blank"),
                          },
                          label: "LeadCENTER",
                      },
                      {
                          component: "button",
                          props: {
                              type: "button",
                              onClick: () => {
                                  handleCSGSSO(navigate, loadingHook);
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
              }),
    };

    useEffect(() => {
        if (leadPreference && !leadPreference?.isAgentMobilePopUpDismissed && !learnMoreModal) {
            setWelcomeModalOpen(true);
        }
    }, [leadPreference, setWelcomeModalOpen, learnMoreModal]);

    useEffect(() => {
        if (user?.agentId && !agentInformation?.agentVirtualPhoneNumber && agentInformation?.isDashboardLocation) {
            setTimeout(() => clientService.genarateAgentTwiloNumber(user?.agentId), 5000);
        }
    }, [agentInformation, user]);

    const updateAgentAvailability = async (data) => {
        try {
            const response = await clientService.updateAgentAvailability(data);
            if (response.ok) {
                getAgentAvailability();
            }
        } catch (error) {
            showToast({
                type: "error",
                message: "Failed to Save the Availability.",
                time: 10000,
            });
            Sentry.captureException(error);
        }
    };

    let showPhoneNotification = false;

    if (auth.isAuthenticated() && user && !user.phone) {
        showPhoneNotification = true;
    }

    const showMaintenaceNotification = process.env.REACT_APP_NOTIFICATION_BANNER === "true";
    const headernotificationClass = [
        "global-nav-v2-",
        showPhoneNotification ? "hasNotification" : null,
        showMaintenaceNotification ? "hasMainitananceNotification" : null,
    ]
        .filter(Boolean)
        .join("-");

    let showBanner = false;
    if (
        agentInformation &&
        agentInformation.leadPreference &&
        !agentInformation.leadPreference.isAgentMobileBannerDismissed
    ) {
        showBanner = true;
    }
    return (
        <>
            <SiteNotification
                showPhoneNotification={showPhoneNotification}
                showMaintenaceNotification={showMaintenaceNotification}
            />
            {!showBanner && (
                <GetStarted
                    leadPreference={leadPreference}
                    learnMoreModal={learnMoreModal}
                    setLearnMoreModal={setLearnMoreModal}
                />
            )}
            <header
                className={`global-nav-v2 ${analyticsService.clickClass(
                    "nav-wrapper"
                )} ${className} ${headernotificationClass}`}
                {...props}
            >
                <a href="#main-content" className="skip-link">
                    Jump to main content
                </a>

                {page === "taskListMobileLayout" ? (
                    <>
                        <div className="backButton" onClick={() => navigate(`/dashboard`)}>
                            <span>
                                <img src={NewBackBtn} alt="Back" />
                            </span>{" "}
                            Back
                        </div>
                        <div className="taskListTitle"> {title}</div>
                    </>
                ) : (
                    <h1 className={`global-nav-v2__title ${analyticsService.clickClass("nav-logo")}`}>
                        <Link to={auth.isAuthenticated() ? "/dashboard" : "/welcome"}>
                            <IntegrityLogo />
                            <span className="visually-hidden">Integrity</span>
                        </Link>
                    </h1>
                )}

                {auth.isAuthenticated() && !menuHidden && (
                    <nav className="global-nav-v2__links">
                        <h2 className="visually-hidden">Main Navigation</h2>
                        {/*
          Causes console error in dev env only due to this issue
          https://github.com/ReactTraining/react-media/issues/139
        */}
                        <Media
                            queries={{
                                small: "(max-width: 883px)",
                            }}
                        >
                            {(matches) => (
                                <React.Fragment>
                                    {matches.small && <SmallFormatMenu {...mobileMenuProps} />}
                                    {!matches.small && <LargeFormatMenu {...menuProps} />}
                                    {leadPreference && (
                                        <MyButton
                                            leadPreference={leadPreference}
                                            page={page}
                                            hasActiveCampaign={agentInformation?.hasActiveCampaign}
                                        />
                                    )}
                                </React.Fragment>
                            )}
                        </Media>
                    </nav>
                )}
            </header>
            {auth.isAuthenticated() && !menuHidden && <InboundCallBanner agentInformation={agentInformation} />}
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

export default GlobalNavV2;
