import React from "react";
import Router from "components/functional/router";
import { Route, Switch } from "react-router-dom";
import AuthContext from "contexts/auth";
import AuthService from "services/auth";
import DashboardPage from "pages/DashboardPage";
import ResourcesPage from "pages/ResourcesPage";
import LandingPage from "pages/LandingPage";
import AccountPage from "pages/AccountPage";
import ClientManagementPage from "pages/ClientManagementPage";
import NotFoundPage from "pages/NotFound";
import TermsPage from "pages/TermsPage";
import PrivacyPage from "pages/PrivacyPage";
import AuthSigninCallback from "components/functional/auth-signin-callback";
import AuthSignoutCallback from "components/functional/auth-signout-callback";
import AuthSilentCallback from "components/functional/auth-silent-callback";
import {
  AuthenticatedRoute,
  UnauthenticatedRoute,
} from "components/functional/auth-routes";

const App = () => {
  return (
    <AuthContext.Provider value={AuthService}>
      <Router>
        <div className="content-frame">
          <Switch>
            <Route
              exact={true}
              path="/signin-oidc-silent"
              component={AuthSilentCallback}
            />
            <Route
              exact={true}
              path="/signin-oidc"
              component={AuthSigninCallback}
            />
            <Route
              exact={true}
              path="/signout-oidc"
              component={AuthSignoutCallback}
            />
            <UnauthenticatedRoute exact path="/">
              <LandingPage />
            </UnauthenticatedRoute>
            <AuthenticatedRoute exact path="/dashboard">
              <DashboardPage />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/account">
              <AccountPage />
            </AuthenticatedRoute>
            <AuthenticatedRoute path="/resources">
              <ResourcesPage />
            </AuthenticatedRoute>
            <AuthenticatedRoute path="/clients">
              <ClientManagementPage />
            </AuthenticatedRoute>
            <Route path="/terms">
              <TermsPage />
            </Route>
            <Route path="/privacy">
              <PrivacyPage />
            </Route>
            <Route path="*">
              <NotFoundPage />
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
