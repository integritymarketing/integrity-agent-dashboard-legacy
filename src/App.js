import React, { useContext, useEffect } from "react";
import Router from "components/functional/router";
import { Route, Switch, Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import TrafficDirector from "components/functional/traffic-director";
import AuthContext from "contexts/auth";
import authService from "services/authService";
import HomePage from "pages/HomePage";
import ResourcesPage from "pages/ResourcesPage";
import AccountPage from "pages/AccountPage";
import ClientManagementPage from "pages/ClientManagementPage";
import NotFoundPage from "pages/NotFound";
import ErrorPage from "pages/ErrorPage";
import TermsPage from "pages/TermsPage";
import PrivacyPage from "pages/PrivacyPage";
import WelcomePage from "pages/WelcomePage";
import PortalUrl from "components/functional/portal-url";
import AuthSigninRedirectPage from "pages/auth/SigninRedirectPage";
import AuthSigninCallback from "components/functional/auth-signin-callback";
import AuthSignoutCallback from "components/functional/auth-signout-callback";
import AuthSilentCallback from "components/functional/auth-silent-callback";
import useFlashMessage from "hooks/useFlashMessage";
import {
  AuthenticatedRoute,
  UnauthenticatedRoute,
} from "components/functional/auth-routes";

const AuthUserGlobalMessages = () => {
  const auth = useContext(AuthContext);
  const { show: showMessage } = useFlashMessage();

  useEffect(() => {
    if (auth.isAuthenticated()) {
      const profile = auth.getAuthenticatedUserProfile();
      if (profile && profile.phone) {
        showMessage(
          <div>
            <span>&#9888;</span> Sorry, we couldn’t find the phone number with
            this account. Please <Link to="/edit-account">update</Link> your
            information.
          </div>,
          { type: "error1" }
        );
      }
    }
  }, [auth,showMessage]);

  return null;
};

const App = () => {
  return (
    <AuthContext.Provider value={authService}>
      <HelmetProvider>
        <Router>
          <Helmet>
            <title>MedicareCENTER</title>
          </Helmet>
          <AuthUserGlobalMessages />
          <div className="content-frame">
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
              <AuthenticatedRoute path="/clients">
                <ClientManagementPage />
              </AuthenticatedRoute>

              <Route path="/terms">
                <TermsPage />
              </Route>
              <Route path="/privacy">
                <PrivacyPage />
              </Route>

              {/* auth routes + callbacks */}
              <Route path="/signin" component={AuthSigninRedirectPage} />
              <Route
                path="/signin-oidc-silent"
                component={AuthSilentCallback}
              />
              <Route
                path="/signin-oidc-silent"
                component={AuthSilentCallback}
              />
              <Route path="/signin-oidc" component={AuthSigninCallback} />
              <Route path="/signout-oidc" component={AuthSignoutCallback} />

              <Route path="/error">
                <ErrorPage />
              </Route>
              <Route path="*">
                <NotFoundPage />
              </Route>
            </Switch>
          </div>
          <PortalUrl />
        </Router>
      </HelmetProvider>
    </AuthContext.Provider>
  );
};

export default App;
