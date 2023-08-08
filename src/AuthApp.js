import React, { lazy, Suspense } from "react";
import Router from "components/functional/router";
import { Route, Switch } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import AuthClientId from "components/functional/auth/client-id";
import AuthClientUrl from "components/functional/auth/client-url";
import usePortalUrl from "hooks/usePortalUrl";
import { theme } from "./theme";
import { ThemeProvider } from '@mui/material/styles';
import { ToastContextProvider } from "components/ui/Toast/ToastContext";

const ServerLoginPage = lazy(() => import("pages/auth/ServerLoginPage"));
const ServerLogoutPage = lazy(() => import("pages/auth/ServerLogoutPage"));
const ServerErrorPage = lazy(() => import("pages/auth/ServerErrorPage"));
const RegistrationPage = lazy(() => import("pages/auth/RegistrationPage"));
const RegistrationConfirmEmailPage = lazy(() => import("pages/auth/RegistrationConfirmEmailPage"));
const RegistrationConfirmLinkExpiredPage = lazy(() => import("pages/auth/RegistrationConfirmLinkExpiredPage"));
const RegistrationCheckEmailPage = lazy(() => import("pages/auth/RegistrationCheckEmailPage"));
const RegistrationCompletedPage = lazy(() => import("pages/auth/RegistrationCompletedPage"));
const ForgotPasswordPage = lazy(() => import("pages/auth/ForgotPasswordPage"));
const ForgotPasswordSentPage = lazy(() => import("pages/auth/ForgotPasswordSentPage"));
const PasswordResetPage = lazy(() => import("pages/auth/PasswordResetPage"));
const PasswordLinkExpiredPage = lazy(() => import("pages/auth/PasswordLinkExpiredPage"));
const PasswordUpdatedPage = lazy(() => import("pages/auth/PasswordUpdatedPage"));
const FinalErrorPage = lazy(() => import("pages/auth/FinalErrorPage"));
const NewEmailPage = lazy(() => import("pages/auth/NewEmailPage"));
const EmailUpdatedPage = lazy(() => import("pages/auth/EmailUpdatedPage"));
const ContactSupport = lazy(() => import("pages/auth/ContactSupport"));
const ContactSupportInvalidNPN = lazy(() => import("pages/auth/ContactSupportInvalidNPN"));
const UpdateMobileApp = lazy(() => import("pages/auth/UpdateMobileApp"));

const AuthApp = () => {
  const portalUrl = usePortalUrl();
  const handleRedirectAndRestartLoginFlow = () => {
    window.location = portalUrl + "/signin";
  };
  return (
    <ThemeProvider theme={theme}>
      <HelmetProvider>
          <ToastContextProvider>
            <Router>
              <Helmet>
                <title>MedicareCENTER</title>
              </Helmet>
              <div className="content-frame">
                <Suspense fallback={<div>Loading...</div>}>
                  <Switch>
                    <Route exact path="/login" component={ServerLoginPage} />
                    <Route exact path="/logout" component={ServerLogoutPage} />
                    <Route exact path="/error" component={ServerErrorPage} />

                    <Route exact path="/register" component={RegistrationPage} />
                    <Route exact path="/registration-email-sent" component={RegistrationCheckEmailPage} />
                    <Route exact path="/confirm-email" component={RegistrationConfirmEmailPage} />
                    <Route exact path="/confirm-link-expired" component={RegistrationConfirmLinkExpiredPage} />
                    <Route exact path="/registration-complete" component={RegistrationCompletedPage} />

                    <Route exact path="/forgot-password" component={ForgotPasswordPage} />
                    <Route exact path="/password-reset-sent" component={ForgotPasswordSentPage} />
                    <Route exact path="/reset-password" component={PasswordResetPage} />
                    <Route exact path="/password-link-expired" component={PasswordLinkExpiredPage} />
                    <Route exact path="/password-updated" component={PasswordUpdatedPage} />
                    <Route exact path="/sorry" component={FinalErrorPage} />
                    <Route exact path="/update-email" component={NewEmailPage} />
                    <Route exact path="/email-updated" component={EmailUpdatedPage} />

                    <Route exact path="/contact-support" component={ContactSupport} />

                    <Route exact path="/contact-support-invalid-npn/:npnId" component={ContactSupportInvalidNPN} />
                    <Route exact path="/mobile-app-update" component={UpdateMobileApp} />
                    <Route path="*" component={handleRedirectAndRestartLoginFlow} />
                  </Switch>
                </Suspense>
              </div>

              <Suspense fallback={<div>Loading...</div>}>
                <AuthClientId />
                <AuthClientUrl />
              </Suspense>
            </Router>
          </ToastContextProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
};

export default AuthApp;