import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AuthContext from "contexts/auth";
import AuthService from "services/auth";
import DashboardPage from "pages/DashboardPage";
import ResourcesPage from "pages/ResourcesPage";
import LandingPage from "pages/LandingPage";
import AccountPage from "pages/AccountPage";
import NotFoundPage from "pages/NotFound";
import TermsPage from "pages/TermsPage";
import PrivacyPage from "pages/PrivacyPage";
import AuthLogoutCallback from "components/functional/auth-logout-callback";
import AuthSilentCallback from "components/functional/auth-silent-callback";
import AuthCallback from "components/functional/auth-callback";
import {
  AuthenticatedRoute,
  UnauthenticatedRoute,
} from "components/auth/routes";
import { FlashProvider } from "contexts/flash";
import FlashMessage from "partials/flash-message";
import ScrollToTop from "components/functional/scroll-to-top";

const App = () => {
  return (
    <AuthContext.Provider value={AuthService}>
      <Router>
        <ScrollToTop />
        <FlashProvider>
          <FlashMessage />
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
                component={AuthCallback}
              />
              <Route
                exact={true}
                path="/signout-oidc"
                component={AuthLogoutCallback}
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
              <AuthenticatedRoute path="/terms">
                <TermsPage />
              </AuthenticatedRoute>
              <AuthenticatedRoute path="/privacy">
                <PrivacyPage />
              </AuthenticatedRoute>
              <Route path="*">
                <NotFoundPage />
              </Route>
            </Switch>
          </div>
        </FlashProvider>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
