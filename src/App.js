import React from "react";
import Router from "components/functional/router";
import { Route, Switch, Redirect } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import TrafficDirector from "components/functional/traffic-director";
import AuthContext from "contexts/auth";
import authService from "services/authService";
import HomePage from "pages/HomePage";
import ResourcesPage from "pages/ResourcesPage";
import AccountPage from "pages/AccountPage";
import ClientImportPage from "pages/ClientImportPage";
import NotFoundPage from "pages/NotFound";
import ErrorPage from "pages/ErrorPage";
import TermsPage from "pages/TermsPage";
import PrivacyPage from "pages/PrivacyPage";
import WelcomePage from "pages/WelcomePage";
import MaintenancePage from "pages/MaintenancePage";
import PlansPage from "pages/PlansPage";
import NewScopeOfAppointment from "pages/contacts/contactRecordInfo/newScopeOfAppointment";
import PortalUrl from "components/functional/portal-url";
import AuthSigninRedirectPage from "pages/auth/SigninRedirectPage";
import AuthSigninCallback from "components/functional/auth-signin-callback";
import AuthSignoutCallback from "components/functional/auth-signout-callback";
import AuthSilentCallback from "components/functional/auth-silent-callback";
import ContactsPage from "pages/contacts/ContactsPage";
import AddNewContactPage from "pages/contacts/AddNewContactPage";
import ContactRecordInfo from "pages/contacts/contactRecordInfo";
import {
  AuthenticatedRoute,
  UnauthenticatedRoute,
} from "components/functional/auth-routes";
import { ToastContextProvider } from "components/ui/Toast/ToastContext";
import { DeleteLeadProvider } from "contexts/deleteLead";
import { CountyProvider } from "contexts/counties";
import { ContactsProvider } from "contexts/contacts";
import { BackNavProvider } from "contexts/backNavProvider";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken =
  "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";
const App = () => {
  return (
    <AuthContext.Provider value={authService}>
       <ToastContextProvider>
      <CountyProvider>
        <DeleteLeadProvider>
          <ContactsProvider>
            <BackNavProvider>
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
                          <WelcomePage />
                        </UnauthenticatedRoute>
                        <AuthenticatedRoute path="/home">
                          <HomePage />
                        </AuthenticatedRoute>

                      <AuthenticatedRoute path="/edit-account">
                        <AccountPage />
                      </AuthenticatedRoute>
                      <AuthenticatedRoute path="/learning-center">
                        <ResourcesPage />
                      </AuthenticatedRoute>
                      <AuthenticatedRoute path="/contacts">
                        <ContactsPage />
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
                      <AuthenticatedRoute exact path="/contact/:contactId">
                        <ContactRecordInfo />
                      </AuthenticatedRoute>
                      <AuthenticatedRoute path="/new-soa">
                          <NewScopeOfAppointment />
                        </AuthenticatedRoute>
                      <AuthenticatedRoute path="/client-import">
                        <ClientImportPage />
                      </AuthenticatedRoute>
                      <AuthenticatedRoute path="/plans/:contactId">
                        <PlansPage />
                      </AuthenticatedRoute>
                      <AuthenticatedRoute path="/plans/:contactId">
                        <PlansPage />
                      </AuthenticatedRoute>
                      <Route path="/terms">
                        <TermsPage />
                      </Route>
                      <Route path="/privacy">
                        <PrivacyPage />
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
            </BackNavProvider>
          </ContactsProvider>
        </DeleteLeadProvider>
      </CountyProvider>
      </ToastContextProvider>
    </AuthContext.Provider>
  );
};

export default App;
