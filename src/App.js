import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AuthContext from "contexts/auth";
import authService from "services/auth";
import DashboardPage from "pages/DashboardPage";
import TrainingPage from "pages/TrainingPage";
import LandingPage from "pages/LandingPage";
import AccountPage from "pages/AccountPage";
import NotFoundPage from "pages/NotFound";
import LogoutCallback from "components/auth/logoutCallback";
import AuthSilentCallback from "components/auth/authSilentCallback";
import AuthCallback from "components/auth/authCallback";
import {
  AuthenticatedRoute,
  UnauthenticatedRoute,
} from "components/auth/routes";

const App = () => {
  return (
    <AuthContext.Provider value={authService}>
      <Router>
        <div className="content-frame">
          <Switch>
            <Route
              exact={true}
              path="/signin-oidc-silent"
              component={AuthSilentCallback}
            />
            <Route exact={true} path="/signin-oidc" component={AuthCallback} />
            <Route
              exact={true}
              path="/signout-oidc"
              component={LogoutCallback}
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
            <AuthenticatedRoute path="/training">
              <TrainingPage />
            </AuthenticatedRoute>
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
