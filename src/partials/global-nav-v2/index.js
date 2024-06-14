import { useEffect, useState } from "react";
import Media from "react-media";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useSetRecoilState, useRecoilState } from "recoil";
import { welcomeModalOpenAtom, welcomeModalTempOpenAtom } from "recoil/agent/atoms";

import useAgentInformationByID from "hooks/useAgentInformationByID";
import useLoading from "hooks/useLoading";
import useUserProfile from "hooks/useUserProfile";

import GetStarted from "packages/GetStarted";
import InboundCallBanner from "packages/InboundCallBanner";

import IntegrityLogo from "components/HeaderWithLogin/Integrity-logo";
import WithLoader from "components/ui/WithLoader";
import Modal from "components/ui/modal";

import ContactInfo from "partials/contact-info";
import analyticsService from "services/analyticsService";
import { useClientServiceContext } from "services/clientServiceProvider";

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
import IntegrityMobileLogo from "components/HeaderWithLogin/integrity-mobile-logo";
import NewBackBtn from "images/new-back-btn.svg";

const handleCSGSSO = async (navigate, loading, getAccessToken) => {
    loading.begin(0);

    const token = await getAccessToken();
    const response = await fetch(`${process.env.REACT_APP_AUTH_AUTHORITY_URL}/external/csglogin/`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
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
    const auth = useAuth0();
    const { clientsService } = useClientServiceContext();
    const navigate = useNavigate();
    const loadingHook = useLoading();
    const setWelcomeModalOpen = useSetRecoilState(welcomeModalOpenAtom);
    const [welcomeModalTempOpen] = useRecoilState(welcomeModalTempOpenAtom);

    const [navOpen, setNavOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const [helpModalOpen, setHelpModalOpen] = useState(false);
    const [learnMoreModal, setLearnMoreModal] = useState(false);
    const user = useUserProfile();

    const { agentInformation } = useAgentInformationByID();
    const leadPreference = agentInformation?.leadPreference;

    const mobileMenuProps = {
        navOpen,
        setNavOpen,
        ...(auth.isAuthenticated && !menuHidden
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
                      ...(user?.fullName
                          ? [
                                {
                                    component: Link,
                                    props: { to: "/account" },
                                    label: "Account",
                                    img: MobileAccount,
                                },
                            ]
                          : []),
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
                                  handleCSGSSO(navigate, loadingHook, auth.getAccessTokenSilently);
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
                          label: "MedicareLINK",
                      },
                      {
                          component: "button",
                          props: {
                              type: "button",
                              onClick: () => {
                                  window.open(
                                      `${process.env.REACT_APP_CONNECTURE_LINK}/${user.npn}/${process.env.REACT_APP_CURRENT_PLAN_YEAR}`,
                                      "_blank"
                                  );
                              },
                          },
                          label: "MedicareAPP",
                      },
                  ],
                  tertiary: [
                      {
                          component: "button",
                          props: {
                              type: "button",
                              onClick: () =>
                                  auth.logout({
                                      logoutParams: {
                                          returnTo: window.location.origin,
                                      },
                                  }),
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
        ...(auth.isAuthenticated && !menuHidden
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
                      ...(user.firstName
                          ? [
                                {
                                    component: Link,
                                    props: { to: "/account" },
                                    label: "Account",
                                    img: Account,
                                },
                            ]
                          : []),
                      {
                          component: "button",
                          props: {
                              type: "button",
                              onClick: () =>
                                  window.open(
                                      `${process.env.REACT_APP_AUTH0_LEADS_REDIRECT_URI}/LeadCenterSSO`,
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
                                  window.open(
                                      `${process.env.REACT_APP_CONNECTURE_LINK}/${user.npn}/${process.env.REACT_APP_CURRENT_PLAN_YEAR}`,
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
                              onClick: () =>
                                  auth.logout({
                                      logoutParams: {
                                          returnTo: window.location.origin,
                                      },
                                  }),
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
        if (leadPreference && !leadPreference?.isAgentMobilePopUpDismissed && !welcomeModalTempOpen) {
            setWelcomeModalOpen(true);
        }
    }, [leadPreference, setWelcomeModalOpen, welcomeModalTempOpen]);

    useEffect(() => {
        if (user?.agentId && !agentInformation?.agentVirtualPhoneNumber && agentInformation?.isDashboardLocation) {
            setTimeout(() => clientsService.genarateAgentTwiloNumber(user?.agentId), 5000);
        }
    }, [agentInformation, clientsService, user]);

    let showPhoneNotification = false;

    if (auth.isAuthenticated && user && !user.phone) {
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
        <WithLoader isLoading={auth.isLoading}>
            <Media
                query={"(max-width: 883px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <SiteNotification
                showPhoneNotification={showPhoneNotification}
                showMaintenaceNotification={showMaintenaceNotification}
            />
            {showBanner && (
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
                        <div className="taskListTitle">{title}</div>
                    </>
                ) : (
                    <div className={`global-nav-v2__title ${analyticsService.clickClass("nav-logo")}`}>
                        {isMobile && leadPreference && (
                            <MyButton
                                leadPreference={leadPreference}
                                page={page}
                                hasActiveCampaign={agentInformation?.hasActiveCampaign}
                            />
                        )}

                        <Link to={auth.isAuthenticated ? "/dashboard" : "/welcome"}>
                            {isMobile ? <IntegrityMobileLogo /> : <IntegrityLogo />}
                            <span className="visually-hidden">Integrity</span>
                        </Link>
                    </div>
                )}

                {auth.isAuthenticated && !menuHidden && (
                    <nav className="global-nav-v2__links">
                        <h2 className="visually-hidden">Main Navigation</h2>
                        {/*
          Causes console error in dev env only due to this issue
          https://github.com/ReactTraining/react-media/issues/139
        */}
                        {isMobile && <SmallFormatMenu {...mobileMenuProps} />}
                        <div className="onlyWeb">
                            {!isMobile && <LargeFormatMenu {...menuProps} />}
                            {!isMobile && user?.firstName && leadPreference && (
                                <MyButton
                                    leadPreference={leadPreference}
                                    page={page}
                                    hasActiveCampaign={agentInformation?.hasActiveCampaign}
                                />
                            )}
                        </div>
                    </nav>
                )}
            </header>

            {auth.isAuthenticated && !menuHidden && <InboundCallBanner agentInformation={agentInformation} />}
            <Modal
                open={helpModalOpen}
                onClose={() => setHelpModalOpen(false)}
                labeledById="dialog_help_label"
                descById="dialog_help_desc"
                testId={"header-support-modal"}
            >
                <ContactInfo testId={"header-support-modal"} />
            </Modal>
        </WithLoader>
    );
};

export default GlobalNavV2;
