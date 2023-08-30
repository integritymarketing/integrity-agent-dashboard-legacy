import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "@mui/material/styles";
import Media from "react-media";
import {
  AuthenticatedRoute,
  UnauthenticatedRoute,
} from "components/functional/auth-routes";
import { ToastContextProvider } from "components/ui/Toast/ToastContext";
import { DeleteLeadProvider } from "contexts/deleteLead";
import { CountyProvider } from "contexts/counties";
import { ContactsProvider } from "contexts/contacts";
import { BackNavProvider } from "contexts/backNavProvider";
import { StageSummaryProvider } from "contexts/stageSummary";
import { ParallaxProvider } from "react-scroll-parallax";
import AuthContext from "contexts/auth";
import authService from "services/authService";
import { theme } from "./theme";

const Router = lazy(() => import("components/functional/router"));

const TrafficDirector = lazy(() =>
  import("components/functional/traffic-director")
);
const WebChatComponent = lazy(() => import("components/WebChat/WebChat"));
const ResourcesPage = lazy(() => import("pages/ResourcesPage"));
const AccountPage = lazy(() => import("pages/AccountPage"));
const ClientImportPage = lazy(() => import("pages/ClientImportPage"));
const NotFoundPage = lazy(() => import("pages/NotFound"));
const ErrorPage = lazy(() => import("pages/ErrorPage"));
const TermsPage = lazy(() => import("pages/TermsPage"));
const PrivacyPage = lazy(() => import("pages/PrivacyPage"));
const ContactDetailsPage = lazy(() => import("pages/ContactDetails"));
const MaintenancePage = lazy(() => import("pages/MaintenancePage"));
const PlansPage = lazy(() => import("pages/PlansPage"));
const LeadCenterRedirect = lazy(() => import("pages/LeadCenterRedirect"));
const Dashboard = lazy(() => import("pages/dashbaord"));
const ComparePlansPage = lazy(() => import("pages/ComparePlansPage"));
const ComparePlansCodePage = lazy(() => import("pages/ComparePlansCodePage"));
const LinkToContact = lazy(() => import("pages/LinkToContact"));
const NewScopeOfAppointment = lazy(() =>
  import("pages/contacts/contactRecordInfo/newScopeOfAppointment")
);
const SOAConfirmationPage = lazy(() =>
  import(
    "pages/contacts/contactRecordInfo/scopeOfAppointmentConfirmation/ConfirmationPage"
  )
);
const SOAConfirmationForm = lazy(() =>
  import("pages/contacts/contactRecordInfo/scopeOfAppointmentConfirmation")
);
const PortalUrl = lazy(() => import("components/functional/portal-url"));
const AuthSigninRedirectPage = lazy(() =>
  import("pages/auth/SigninRedirectPage")
);
const AuthSigninCallback = lazy(() =>
  import("components/functional/auth-signin-callback")
);
const AuthSignoutCallback = lazy(() =>
  import("components/functional/auth-signout-callback")
);
const AuthSilentCallback = lazy(() =>
  import("components/functional/auth-silent-callback")
);
const ContactsPage = lazy(() => import("pages/contacts/ContactsPage"));
const AddNewContactPage = lazy(() =>
  import("pages/contacts/AddNewContactPage")
);
const ContactRecordInfo = lazy(() =>
  import("pages/contacts/contactRecordInfo")
);
const ContactsSOAConfirmForm = lazy(() =>
  import("pages/contacts/soa/ContactsSOAConfirmForm")
);
const PlanDetailsPage = lazy(() => import("pages/PlanDetailsPage"));
const RedirectLoadingPage = lazy(() => import("pages/RedirectLoading"));
const HelpPage = lazy(() => import("pages/Help"));
const Welcome = lazy(() => import("pages/welcome"));
const LandingPage = lazy(() => import("mobile/landing/LandingPage"));
const EnrollmentLinkToContact = lazy(() =>
  import("pages/EnrollmentLinkToContact")
);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={authService}>
        <RecoilRoot>
          <Suspense fallback={<div>Loading...</div>}>
            <ParallaxProvider>
              <ToastContextProvider>
                <CountyProvider>
                  <DeleteLeadProvider>
                    <ContactsProvider>
                      <BackNavProvider>
                        <StageSummaryProvider>
                          <HelmetProvider>
                            <Router>
                              <Helmet>
                                <title>MedicareCENTER</title>
                              </Helmet>
                              <div className="content-frame">
                                {process.env.REACT_APP_MAINTENANCE_MODE ? (
                                  <Switch>
                                    <Route path="/maintenance">
                                      <MaintenancePage />
                                    </Route>
                                    <Route path="*">
                                      <Redirect to="/maintenance" />
                                    </Route>
                                  </Switch>
                                ) : (
                                  <Switch>
                                    {/* root path directs traffic to unauthenticed
              Welcome or authenticated Home page */}
                                    <Route exact path="/">
                                      <TrafficDirector />
                                    </Route>

                                    <UnauthenticatedRoute path="/welcome">
                                      <Media
                                        queries={{
                                          small: "(max-width: 767px)",
                                        }}
                                      >
                                        {(matches) =>
                                          matches.small ? (
                                            <LandingPage />
                                          ) : (
                                            <Welcome />
                                          )
                                        }
                                      </Media>
                                    </UnauthenticatedRoute>
                                    <AuthenticatedRoute path="/redirect-loading">
                                      <RedirectLoadingPage />
                                    </AuthenticatedRoute>
                                    <AuthenticatedRoute path="/home">
                                      <Dashboard />
                                    </AuthenticatedRoute>
                                    <AuthenticatedRoute path="/dashboard">
                                      <Dashboard />
                                    </AuthenticatedRoute>
                                    <AuthenticatedRoute path="/link-to-contact/:callLogId/:callFrom/:duration/:date">
                                      <LinkToContact />
                                    </AuthenticatedRoute>
                                    <AuthenticatedRoute path="/enrollment-link-to-contact">
                                        <EnrollmentLinkToContact />
                                      </AuthenticatedRoute>
                                    <AuthenticatedRoute path="/account">
                                      <AccountPage />
                                    </AuthenticatedRoute>
                                    <AuthenticatedRoute path="/help">
                                      <HelpPage />
                                    </AuthenticatedRoute>
                                    <AuthenticatedRoute path="/learning-center">
                                      <ResourcesPage />
                                    </AuthenticatedRoute>
                                    <AuthenticatedRoute path="/contacts">
                                      <ContactsPage />
                                    </AuthenticatedRoute>
                                    <AuthenticatedRoute path="/contact/add-new/:callLogId">
                                      <AddNewContactPage />
                                    </AuthenticatedRoute>
                                    <AuthenticatedRoute path="/contact/add-new">
                                      <AddNewContactPage />
                                    </AuthenticatedRoute>
                                    <AuthenticatedRoute
                                      exact
                                      path="/contact/:contactId/duplicate/:duplicateLeadId"
                                    >
                                      <ContactRecordInfo />
                                    </AuthenticatedRoute>
                                    <AuthenticatedRoute
                                      exact
                                      path="/contact/:contactId"
                                    >
                                      <ContactRecordInfo />
                                    </AuthenticatedRoute>
                                    <AuthenticatedRoute
                                      exact
                                      path="/contact/:contactId/:sectionId"
                                    >
                                      <ContactRecordInfo />
                                    </AuthenticatedRoute>
                                    <AuthenticatedRoute
                                      exact
                                      path="/new/contact/:contactId"
                                    >
                                      <ContactDetailsPage />
                                    </AuthenticatedRoute>
                                    <AuthenticatedRoute path="/new-soa/:leadId">
                                      <NewScopeOfAppointment />
                                    </AuthenticatedRoute>
                                    <AuthenticatedRoute
                                      exact
                                      path="/contact/:contactId/soa-confirm/:linkCode"
                                    >
                                      <ContactsSOAConfirmForm />
                                    </AuthenticatedRoute>
                                    <AuthenticatedRoute path="/leadcenter-redirect/:npn">
                                      <LeadCenterRedirect />
                                    </AuthenticatedRoute>
                                    <AuthenticatedRoute path="/client-import">
                                      <ClientImportPage />
                                    </AuthenticatedRoute>
                                    <AuthenticatedRoute path="/plans/:contactId/compare/:planIds/:effectiveDate">
                                      <ComparePlansPage />
                                    </AuthenticatedRoute>
                                    <AuthenticatedRoute path="/plans/:contactId">
                                      <PlansPage />
                                    </AuthenticatedRoute>
                                    <AuthenticatedRoute path="/:contactId/plan/:planId/:effectiveDate">
                                      <PlanDetailsPage />
                                    </AuthenticatedRoute>
                                    <Route path="/terms">
                                      <TermsPage />
                                    </Route>
                                    <Route path="/privacy">
                                      <PrivacyPage />
                                    </Route>
                                    <Route path="/soa-confirmation-form/:linkCode/:token">
                                      <SOAConfirmationForm />
                                    </Route>
                                    <Route path="/customer/plans/:contactId/compare/:planIds/:effectiveDate/:request/:token">
                                      <ComparePlansCodePage />
                                    </Route>
                                    <Route path="/soa-confirmation-page/:firstName/:lastName">
                                      <SOAConfirmationPage />
                                    </Route>
                                    {/* auth routes + callbacks */}
                                    <Route
                                      path="/signin"
                                      component={AuthSigninRedirectPage}
                                    />
                                    <Route
                                      path="/signin-oidc-silent"
                                      component={AuthSilentCallback}
                                    />
                                    <Route
                                      path="/signin-oidc-silent"
                                      component={AuthSilentCallback}
                                    />
                                    <Route
                                      path="/signin-oidc"
                                      component={AuthSigninCallback}
                                    />
                                    <Route
                                      path="/signin-oidc-sunfire-mobile"
                                      component={AuthSigninCallback}
                                    />
                                    <Route
                                      path="/signout-oidc"
                                      component={AuthSignoutCallback}
                                    />
                                    <Route path="/maintenance">
                                      <Redirect to="/" />
                                    </Route>
                                    <Route path="/clients">
                                      <Redirect to="/contacts" />
                                    </Route>
                                    <Route path="/error">
                                      <ErrorPage />
                                    </Route>
                                    <Route path="*">
                                      <NotFoundPage />
                                    </Route>
                                  </Switch>
                                )}
                              </div>
                              {process.env.REACT_APP_ASK_INTEGRITY_FLAG && (
                                <WebChatComponent />
                              )}
                              <PortalUrl />
                            </Router>
                          </HelmetProvider>
                        </StageSummaryProvider>
                      </BackNavProvider>
                    </ContactsProvider>
                  </DeleteLeadProvider>
                </CountyProvider>
              </ToastContextProvider>
            </ParallaxProvider>
          </Suspense>
        </RecoilRoot>
      </AuthContext.Provider>
    </ThemeProvider>
  );
};

export default App;
