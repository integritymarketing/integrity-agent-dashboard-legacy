import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";

import Container from "components/ui/container";
import SimpleHeader from "partials/simple-header";
import SimpleFooter from "partials/simple-footer";
import authService from "services/authService";
import analyticsService from "services/analyticsService";
import CheckIcon from "components/icons/v2-check";
import ResendButtonWithModal from "partials/resend-email";

const resendForgotPassword = async (npn) => {
  return authService.requestPasswordReset({ npn });
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
        <SimpleHeader />
        <Container size="small">
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
        </Container>
        <SimpleFooter />
      </div>
    </React.Fragment>
  );
};
