// External Libraries
import React, { lazy, Suspense } from "react";
import {
  AuthenticatedRoute,
  UnauthenticatedRoute,
} from "components/functional/auth-routes";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ParallaxProvider } from "react-scroll-parallax";
import { RecoilRoot } from "recoil";
import { Route, Switch, Redirect } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import Media from "react-media";

// Context Providers
import AuthContext from "contexts/auth";
import { BackNavProvider } from "contexts/backNavProvider";
import { ContactsProvider } from "contexts/contacts";
import { CountyProvider } from "contexts/counties";
import { DeleteLeadProvider } from "contexts/deleteLead";
import { StageSummaryProvider } from "contexts/stageSummary";
import { ToastContextProvider } from "components/ui/Toast/ToastContext";
import ErrorBoundary from "components/ErrorBoundary";

// Services
import authService from "services/authService";

// Components and Pages
import { theme } from "./theme";
const AccountPage = lazy(() => import("pages/AccountPage"));
const AddNewContactPage = lazy(() =>
  import("pages/contacts/AddNewContactPage")
);
const AuthSigninCallback = lazy(() =>
  import("components/functional/auth-signin-callback")
);
const AuthSigninRedirectPage = lazy(() =>
  import("pages/auth/SigninRedirectPage")
);
const AuthSignoutCallback = lazy(() =>
  import("components/functional/auth-signout-callback")
);
const AuthSilentCallback = lazy(() =>
  import("components/functional/auth-silent-callback")
);
const ClientImportPage = lazy(() => import("pages/ClientImportPage"));
const ComparePlansPage = lazy(() => import("pages/ComparePlansPage"));
const ContactDetailsPage = lazy(() => import("pages/ContactDetails"));
const ContactRecordInfo = lazy(() =>
  import("pages/contacts/contactRecordInfo")
);
const ComparePlansCodePage = lazy(() => import("pages/ComparePlansCodePage"));
const ContactsPage = lazy(() => import("pages/contacts/ContactsPage"));
const ContactsSOAConfirmForm = lazy(() =>
  import("pages/contacts/soa/ContactsSOAConfirmForm")
);
const Dashboard = lazy(() => import("pages/dashbaord"));
const EnrollmentHistoryPage = lazy(() => import("pages/EnrollmentHistoryPage"));
const EnrollmentLinkToContact = lazy(() =>
  import("pages/EnrollmentLinkToContact")
);
const ErrorPage = lazy(() => import("pages/ErrorPage"));
const HelpPage = lazy(() => import("pages/Help"));
const LandingPage = lazy(() => import("mobile/landing/LandingPage"));
const LeadCenterRedirect = lazy(() => import("pages/LeadCenterRedirect"));
const LinkToContact = lazy(() => import("pages/LinkToContact"));
const MaintenancePage = lazy(() => import("pages/MaintenancePage"));
const NewScopeOfAppointment = lazy(() =>
  import("pages/contacts/contactRecordInfo/newScopeOfAppointment")
);
const NotFoundPage = lazy(() => import("pages/NotFound"));
const PlanDetailsPage = lazy(() => import("pages/PlanDetailsPage"));
const PlansPage = lazy(() => import("pages/PlansPage"));
const PortalUrl = lazy(() => import("components/functional/portal-url"));
const PrivacyPage = lazy(() => import("pages/PrivacyPage"));
const RedirectLoadingPage = lazy(() => import("pages/RedirectLoading"));
const ResourcesPage = lazy(() => import("pages/ResourcesPage"));
const Router = lazy(() => import("components/functional/router"));
const SOAConfirmationForm = lazy(() =>
  import("pages/contacts/contactRecordInfo/scopeOfAppointmentConfirmation")
);
const SOAConfirmationPage = lazy(() =>
  import(
    "pages/contacts/contactRecordInfo/scopeOfAppointmentConfirmation/ConfirmationPage"
  )
);
const TermsPage = lazy(() => import("pages/TermsPage"));
const TrafficDirector = lazy(() =>
  import("components/functional/traffic-director")
);
const WebChatComponent = lazy(() => import("components/WebChat/WebChat"));
const Welcome = lazy(() => import("pages/welcome"));
const PolicyCodePage = lazy(() => import("pages/dashbaord/SharePolicy"));

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
                                <ErrorBoundary>
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
                                        <WebChatComponent />
                                      </AuthenticatedRoute>
                                      <AuthenticatedRoute path="/link-to-contact/:callLogId/:callFrom/:duration/:date">
                                        <LinkToContact />
                                      </AuthenticatedRoute>
                                      <AuthenticatedRoute path="/enrollmenthistory/:contactId/:confirmationNumber/:effectiveDate">
                                        <EnrollmentHistoryPage />
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
                                        <WebChatComponent />
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
                                        <WebChatComponent />
                                      </AuthenticatedRoute>
                                      <AuthenticatedRoute path="/plans/:contactId">
                                        <PlansPage />
                                        <WebChatComponent />
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
                                      <Route path="/customer/enrollmenthistory/:contactId/:confirmationNumber/:effectiveDate/:request/:token">
                                        <PolicyCodePage />
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
                                </ErrorBoundary>
                              </div>
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
