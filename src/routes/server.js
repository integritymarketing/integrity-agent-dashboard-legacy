import React from "react";
import { Route, Switch } from "react-router-dom";
import RegisterPage from "pages/admin/RegisterPage";
import LoginPage from "pages/admin/LoginPage";
import ForgotPasswordPage from "pages/admin/ForgotPasswordPage";
import ResetSentPage from "pages/admin/ResetSentPage";
import NewPasswordPage from "pages/admin/NewPasswordPage";
import PasswordUpdatedPage from "pages/admin/PasswordUpdatedPage";
import RegistrationConfirmedPage from "pages/admin/RegistrationConfirmedPage";
import RegistrationCompletedPage from "pages/admin/RegistrationCompletedPage";
import NewEmailPage from "pages/admin/NewEmailPage";
import EmailUpdatedPage from "pages/admin/EmailUpdatedPage";
import LinkExpiredPage from "pages/admin/LinkExpiredPage";
import ErrorPage from "pages/admin/ErrorPage";
import LogoutPage from "pages/admin/LogoutPage";

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
    <Route exact path="/registration-confirmed">
      <RegistrationConfirmedPage />
    </Route>
    <Route exact path="/registration-complete">
      <RegistrationCompletedPage />
    </Route>
  </Switch>
);
