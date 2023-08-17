import React, { Suspense, lazy } from "react";
import Router from "components/functional/router";
import { Route, Switch, Redirect } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { RecoilRoot } from "recoil";
import { theme } from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import Media from "react-media";
import TrafficDirector from "components/functional/traffic-director";
import { ClientServiceContextProvider } from "services/clientServiceProvider";
import Auth0ProviderWithHistory from "auth/Auth0ProviderWithHistory";

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
import WebChatComponent from "components/WebChat/WebChat";

const AccountPage = lazy(() => import("pages/AccountPage"));
const AddNewContactPage = lazy(() =>
  import("pages/contacts/AddNewContactPage")
);
const AuthSigninRedirectPage = lazy(() =>
  import("pages/auth/SigninRedirectPage")
);
const ClientImportPage = lazy(() => import("pages/ClientImportPage"));
const ComparePlansCodePage = lazy(() => import("pages/ComparePlansCodePage"));
const ComparePlansPage = lazy(() => import("pages/ComparePlansPage"));
const ContactDetailsPage = lazy(() => import("pages/ContactDetails"));
const ContactRecordInfo = lazy(() =>
  import("pages/contacts/contactRecordInfo")
);
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
const PolicyCodePage = lazy(() => import("pages/dashbaord/SharePolicy"));
const PortalUrl = lazy(() => import("components/functional/portal-url"));
const PrivacyPage = lazy(() => import("pages/PrivacyPage"));
const RedirectLoadingPage = lazy(() => import("pages/RedirectLoading"));
const ResourcesPage = lazy(() => import("pages/ResourcesPage"));
const SOAConfirmationForm = lazy(() =>
  import("pages/contacts/contactRecordInfo/scopeOfAppointmentConfirmation")
);
const SOAConfirmationPage = lazy(() =>
  import(
    "pages/contacts/contactRecordInfo/scopeOfAppointmentConfirmation/ConfirmationPage"
  )
);
const TermsPage = lazy(() => import("pages/TermsPage"));
const Welcome = lazy(() => import("pages/welcome"));

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Auth0ProviderWithHistory>
        <ClientServiceContextProvider>
          <RecoilRoot>
            <Suspense fallback={<div></div>}>
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
                                      <AuthenticatedRoute path="/enrollmenthistory/:contactId/:confirmationNumber/:effectiveDate">
                                        <EnrollmentHistoryPage />
                                      </AuthenticatedRoute>
                                      <Route path="/terms">
                                        <TermsPage />
                                      </Route>
                                      <Route path="/privacy">
                                        <PrivacyPage />
                                      </Route>
                                      <Route path="/soa-confirmation-form/:linkCode">
                                        <SOAConfirmationForm />
                                      </Route>
                                      <Route path="/customer/plans/:contactId/compare/:planIds/:effectiveDate/:request/:token">
                                        <ComparePlansCodePage />
                                      </Route>
                                      <Route path="/customer/policy/details/:confirmationNumber/:request/:token">
                                        <PolicyCodePage />
                                      </Route>
                                      <Route path="/soa-confirmation-page/:firstName/:lastName">
                                        <SOAConfirmationPage />
                                      </Route>
                                      {/* auth routes + callbacks */}
                                      <Route
                                        path="/signin"
                                        component={AuthSigninRedirectPage}
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
                                  {process.env.REACT_APP_ASK_INTEGRITY_FLAG && (
                                    <WebChatComponent />
                                  )}
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
        </ClientServiceContextProvider>
      </Auth0ProviderWithHistory>
    </ThemeProvider>
  );
};

export default App;
