import React from "react";
import { Route, Switch } from "react-router-dom";
import RegisterPage from "pages/auth/RegisterPage";
import LoginPage from "pages/auth/LoginPage";
import ForgotPasswordPage from "pages/auth/ForgotPasswordPage";
import ResetSentPage from "pages/auth/ResetSentPage";
import NewPasswordPage from "pages/auth/NewPasswordPage";
import PasswordUpdatedPage from "pages/auth/PasswordUpdatedPage";
import ConfirmEmailPage from "pages/auth/ConfirmEmailPage";
import RegistrationCompletedPage from "pages/auth/RegistrationCompletedPage";
import NewEmailPage from "pages/auth/NewEmailPage";
import EmailUpdatedPage from "pages/auth/EmailUpdatedPage";
import LinkExpiredPage from "pages/auth/LinkExpiredPage";
import ErrorPage from "pages/auth/ErrorPage";
import LogoutPage from "pages/auth/LogoutPage";

export default () => (
  <Switch>
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
    <Route exact path="/error">
      <ErrorPage />
    </Route>
    <Route exact path="/logout">
      <LogoutPage />
    </Route>
    <Route exact path="/confirm-email">
      <ConfirmEmailPage />
    </Route>
    <Route exact path="/registration-complete">
      <RegistrationCompletedPage />
    </Route>
  </Switch>
);
