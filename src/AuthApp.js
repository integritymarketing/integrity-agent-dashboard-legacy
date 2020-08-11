import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";

// the following routes are configured in IdentityServer
// and are redirected to for each common auth situation
import ServerLoginPage from "pages/auth/ServerLoginPage";
import ServerLogoutPage from "pages/auth/ServerLogoutPage";
import ServerErrorPage from "pages/auth/ServerErrorPage";

import RegistrationPage from "pages/auth/RegistrationPage";
import ConfirmEmailPage from "pages/auth/ConfirmEmailPage";
import RegistrationCheckEmailPage from "pages/auth/RegistrationCheckEmailPage";
import RegistrationCompletedPage from "pages/auth/RegistrationCompletedPage";

import ForgotPasswordPage from "pages/auth/ForgotPasswordPage";
import ForgotPasswordSentPage from "pages/auth/ForgotPasswordSentPage";
import NewPasswordPage from "pages/auth/NewPasswordPage";
import PasswordUpdatedPage from "pages/auth/PasswordUpdatedPage";

import NewEmailPage from "pages/auth/NewEmailPage";
import EmailUpdatedPage from "pages/auth/EmailUpdatedPage";
import LinkExpiredPage from "pages/auth/LinkExpiredPage";

import { FlashProvider } from "contexts/flash";
import FlashMessage from "partials/flash-message";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

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
              <ConfirmEmailPage />
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
          </Switch>
        </div>
      </FlashProvider>
    </Router>
  );
};

export default AuthApp;
