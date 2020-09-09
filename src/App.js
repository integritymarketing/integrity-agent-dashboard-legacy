import React from "react";
import Router from "components/functional/router";
import { Route, Switch } from "react-router-dom";
import TrafficDirector from "components/functional/traffic-director";
import AuthContext from "contexts/auth";
import AuthService from "services/auth";
import DashboardPage from "pages/DashboardPage";
import ResourcesPage from "pages/ResourcesPage";
import AccountPage from "pages/AccountPage";
import NotFoundPage from "pages/NotFound";
import TermsPage from "pages/TermsPage";
import PrivacyPage from "pages/PrivacyPage";
import WelcomePage from "pages/WelcomePage";
import AuthSigninRedirectPage from "pages/auth/SigninRedirectPage";
import AuthSigninCallback from "components/functional/auth-signin-callback";
import AuthSignoutCallback from "components/functional/auth-signout-callback";
import AuthSilentCallback from "components/functional/auth-silent-callback";
import { AuthenticatedRoute } from "components/functional/auth-routes";

const App = () => {
  return (
    <AuthContext.Provider value={AuthService}>
      <Router>
        <div className="content-frame">
          <Switch>
            <Route exact path="/">
              <TrafficDirector />
            </Route>
            <Route path="/welcome">
              <WelcomePage />
            </Route>
            <Route path="/signin" component={AuthSigninRedirectPage} />
            <Route path="/signin-oidc-silent" component={AuthSilentCallback} />
            <Route path="/signin-oidc-silent" component={AuthSilentCallback} />
            <Route path="/signin-oidc" component={AuthSigninCallback} />
            <Route path="/signout-oidc" component={AuthSignoutCallback} />

            <AuthenticatedRoute path="/dashboard">
              <DashboardPage />
            </AuthenticatedRoute>
            <AuthenticatedRoute path="/account">
              <AccountPage />
            </AuthenticatedRoute>
            <AuthenticatedRoute path="/resources">
              <ResourcesPage />
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
