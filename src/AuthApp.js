import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// the following routes (beginning w/ Server*) are configured in IdentityServer
// and are redirected to for each common auth situation
import ServerLoginPage from "pages/auth/ServerLoginPage";
import ServerLogoutPage from "pages/auth/ServerLogoutPage";
import ServerErrorPage from "pages/auth/ServerErrorPage";

import RegistrationPage from "pages/auth/RegistrationPage";
import RegistrationConfirmEmailPage from "pages/auth/RegistrationConfirmEmailPage";
import RegistrationConfirmLinkExpiredPage from "pages/auth/RegistrationConfirmLinkExpiredPage";
import RegistrationCheckEmailPage from "pages/auth/RegistrationCheckEmailPage";
import RegistrationCompletedPage from "pages/auth/RegistrationCompletedPage";

import ForgotPasswordPage from "pages/auth/ForgotPasswordPage";
import ForgotPasswordSentPage from "pages/auth/ForgotPasswordSentPage";
import PasswordResetPage from "pages/auth/PasswordResetPage";
import PasswordLinkExpiredPage from "pages/auth/PasswordLinkExpiredPage";
import PasswordUpdatedPage from "pages/auth/PasswordUpdatedPage";

import FinalErrorPage from "pages/auth/FinalErrorPage";

import NewEmailPage from "pages/auth/NewEmailPage";
import EmailUpdatedPage from "pages/auth/EmailUpdatedPage";

import { FlashProvider } from "contexts/flash";
import FlashMessage from "partials/flash-message";
import ScrollToTop from "components/functional/scroll-to-top";
import AuthService from "services/auth";

const AuthApp = () => {
  return (
    <Router>
      <ScrollToTop />
      <FlashProvider>
        <FlashMessage />
        <div className="content-frame">
          <Switch>
            <Route exact path="/login">
              <ServerLoginPage />
            </Route>
            <Route exact path="/logout">
              <ServerLogoutPage />
            </Route>
            <Route exact path="/error">
              <ServerErrorPage />
            </Route>

            <Route exact path="/register">
              <RegistrationPage />
            </Route>
            <Route exact path="/registration-check-email">
              <RegistrationCheckEmailPage />
            </Route>
            <Route exact path="/confirm-email">
              <RegistrationConfirmEmailPage />
            </Route>
            <Route exact path="/confirm-link-expired">
              <RegistrationConfirmLinkExpiredPage />
            </Route>
            <Route exact path="/registration-complete">
              <RegistrationCompletedPage />
            </Route>

            <Route exact path="/forgot-password">
              <ForgotPasswordPage />
            </Route>
            <Route exact path="/password-reset-sent">
              <ForgotPasswordSentPage />
            </Route>
            <Route exact path="/reset-password">
              <PasswordResetPage />
            </Route>
            <Route exact path="/password-link-expired">
              <PasswordLinkExpiredPage />
            </Route>
            <Route exact path="/password-updated">
              <PasswordUpdatedPage />
            </Route>

            <Route exact path="/sorry">
              <FinalErrorPage />
            </Route>
            <Route exact path="/update-email">
              <NewEmailPage />
            </Route>
            <Route exact path="/email-updated">
              <EmailUpdatedPage />
            </Route>

            <Route
              path="*"
              component={() => {
                AuthService.redirectAndRestartLoginFlow();
                return null;
              }}
            />
          </Switch>
        </div>
      </FlashProvider>
    </Router>
  );
};

export default AuthApp;
