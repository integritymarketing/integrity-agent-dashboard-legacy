import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import DashboardPage from "pages/DashboardPage";
import TrainingPage from "pages/TrainingPage";
import LandingPage from "pages/LandingPage";
import RegisterPage from "pages/admin/RegisterPage"; // TODO: exclude this from main build
import LoginPage from "pages/admin/LoginPage"; // TODO: exclude this from main build
import ForgotPasswordPage from "pages/admin/ForgotPasswordPage"; // TODO: exclude this from main build
import NotFoundPage from "pages/NotFound";
import AuthContext from "contexts/auth";
import Logout from "components/auth/logout";
import LogoutCallback from "components/auth/logoutCallback";
import AuthCallback from "components/auth/authCallback";
import authService from "services/auth";
import {
  AuthenticatedRoute,
  UnauthenticatedRoute,
} from "components/auth/routes";

// TODO: connect to env variable
const EMULATE_REGISTRATION = true;

const App = () => {
  return (
    <AuthContext.Provider value={authService}>
      <Router>
        <div className="content-frame">
          <Switch>
            <Route exact={true} path="/signin-oidc" component={AuthCallback} />
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
            {EMULATE_REGISTRATION && (
              <React.Fragment>
                <Route exact path="/login">
                  <LoginPage />
                </Route>
                <Route exact path="/register">
                  <RegisterPage />
                </Route>
                <Route exact path="/forgot-password">
                  <ForgotPasswordPage />
                </Route>
              </React.Fragment>
            )}
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
