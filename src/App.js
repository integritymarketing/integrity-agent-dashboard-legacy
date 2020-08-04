import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import DashboardPage from "pages/DashboardPage";
import TrainingPage from "pages/TrainingPage";
import LandingPage from "pages/LandingPage";
import NotFoundPage from "pages/NotFound";
import AuthContext from "contexts/auth";
import Logout from "components/auth/logout";
import LogoutCallback from "components/auth/logoutCallback";
import AuthCallback from "components/auth/authCallback";
import AuthSilentCallback from "components/auth/authSilentCallback";
import authService from "services/auth";
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
            <Route exact={true} path="/signin-oidc" component={AuthCallback} />
            <Route
              exact={true}
              path="/signin-oidc-silent"
              component={AuthSilentCallback}
            />
            <Route exact={true} path="/logout" component={Logout} />
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
