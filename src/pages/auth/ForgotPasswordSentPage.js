import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";

import { HeaderUnAuthenticated } from "components/HeaderUnAuthenticated";
import { FooterUnAuthenticated } from "components/FooterUnAuthenticated";
import { ContainerUnAuthenticated } from "components/ContainerUnAuthenticated";
import authService from "services/authService";
import analyticsService from "services/analyticsService";
import CheckIcon from "components/icons/v2-check";
import ResendButtonWithModal from "partials/resend-email";

const resendForgotPassword = async (params) => {
  return authService.requestPasswordReset(params);
};

export default () => {
  useEffect(() => {
    analyticsService.fireEvent("event-content-load", {
      pagePath: "/login/forgot-NPN/confirmation/",
    });
  }, []);

  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Password Reset Sent</title>
      </Helmet>
      <div className="content-frame v2">
        <HeaderUnAuthenticated />
        <ContainerUnAuthenticated>
          <CheckIcon className="mb-2" />
          <div className="hdg--3 mb-4">
            Check your email to complete password reset
          </div>
          <div
            className="text text--secondary"
            data-gtm="reesend-forgot-password-email"
          >
            <ResendButtonWithModal
              resendFn={resendForgotPassword}
              btnClass={analyticsService.clickClass("forgot-resendnow")}
            />
          </div>
        </ContainerUnAuthenticated>
        <FooterUnAuthenticated />
      </div>
    </React.Fragment>
  );
};
