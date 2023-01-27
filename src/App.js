import React, { Suspense } from "react";
import Router from "components/functional/router";
import { Route, Switch, Redirect } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { RecoilRoot } from "recoil";
import { theme } from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import Media from "react-media";
import TrafficDirector from "components/functional/traffic-director";
import AuthContext from "contexts/auth";
import authService from "services/authService";
import ResourcesPage from "pages/ResourcesPage";
import AccountPage from "pages/AccountPage";
import ClientImportPage from "pages/ClientImportPage";
import NotFoundPage from "pages/NotFound";
import ErrorPage from "pages/ErrorPage";
import TermsPage from "pages/TermsPage";
import PrivacyPage from "pages/PrivacyPage";
import ContactDetailsPage from "pages/ContactDetails";
import MaintenancePage from "pages/MaintenancePage";
import PlansPage from "pages/PlansPage";
import LeadCenterRedirect from "pages/LeadCenterRedirect";
import Dashboard from "pages/dashbaord";
import ComparePlansPage from "pages/ComparePlansPage";
import ComparePlansCodePage from "pages/ComparePlansCodePage";
import LinkToContact from "pages/LinkToContact";
import NewScopeOfAppointment from "pages/contacts/contactRecordInfo/newScopeOfAppointment";
import SOAConfirmationPage from "pages/contacts/contactRecordInfo/scopeOfAppointmentConfirmation/ConfirmationPage";
import SOAConfirmationForm from "pages/contacts/contactRecordInfo/scopeOfAppointmentConfirmation";
import PortalUrl from "components/functional/portal-url";
import AuthSigninRedirectPage from "pages/auth/SigninRedirectPage";
import AuthSigninCallback from "components/functional/auth-signin-callback";
import AuthSignoutCallback from "components/functional/auth-signout-callback";
import AuthSilentCallback from "components/functional/auth-silent-callback";
import ContactsPage from "pages/contacts/ContactsPage";
import AddNewContactPage from "pages/contacts/AddNewContactPage";
import ContactRecordInfo from "pages/contacts/contactRecordInfo";
import ContactsSOAConfirmForm from "pages/contacts/soa/ContactsSOAConfirmForm";
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
import PlanDetailsPage from "pages/PlanDetailsPage";
import RedirectLoadingPage from "pages/RedirectLoading";
import HelpPage from "pages/Help";
import Welcome from "pages/welcome";
import { ParallaxProvider } from "react-scroll-parallax";
import LandingPage from "mobile/landing/LandingPage";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={authService}>
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
                                    <AuthenticatedRoute path="/link-to-contact/:callLogId/:callFrom">
                                      <LinkToContact />
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
                                    <Route path="/soa-confirmation-form/:linkCode">
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
