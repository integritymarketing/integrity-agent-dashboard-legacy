import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import DashboardPage from "pages/DashboardPage";
import TrainingPage from "pages/TrainingPage";
import LandingPage from "pages/LandingPage";
import RegisterPage from "pages/admin/RegisterPage"; // TODO: exclude this from main build
import LoginPage from "pages/admin/LoginPage"; // TODO: exclude this from main build
import ForgotPasswordPage from "pages/admin/ForgotPasswordPage"; // TODO: exclude this from main build
import ResetSentPage from "pages/admin/ResetSentPage"; // TODO: exclude this from main build
import NewPasswordPage from "pages/admin/NewPasswordPage"; // TODO: exclude this from main build
import PasswordUpdatedPage from "pages/admin/PasswordUpdatedPage"; // TODO: exclude this from main build
import RegistrationConfirmedPage from "pages/admin/RegistrationConfirmedPage"; // TODO: exclude this from main build
import RegistrationCompletedPage from "pages/admin/RegistrationCompletedPage"; // TODO: exclude this from main build
import NewEmailPage from "pages/admin/NewEmailPage"; // TODO: exclude this from main build
import EmailUpdatedPage from "pages/admin/EmailUpdatedPage"; // TODO: exclude this from main build
import LinkExpiredPage from "pages/admin/LinkExpiredPage"; // TODO: exclude this from main build
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

// TODO: connect to env variable
const EMULATE_REGISTRATION = true;

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
                <Route exact path="/reset-sent">
                  <ResetSentPage />
                </Route>
                <Route exact path="/new-password">
                  <NewPasswordPage />
                </Route>
                <Route exact path="/password-updated">
                  <PasswordUpdatedPage />
                </Route>
                <Route exact path="/update-email">
                  <NewEmailPage />
                </Route>
                <Route exact path="/email-updated">
                  <EmailUpdatedPage />
                </Route>
                <Route exact path="/link-expired">
                  <LinkExpiredPage />
                </Route>
                <Route exact path="/registration-confirmed">
                  <RegistrationConfirmedPage />
                </Route>
                <Route exact path="/registration-complete">
                  <RegistrationCompletedPage />
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
