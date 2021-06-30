import React from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SimpleHeader from "partials/simple-header";
import SimpleFooter from "partials/simple-footer";
import Container from "components/ui/container";
import MailIcon from "components/icons/v2-mail";
import PhoneIcon from "components/icons/v2-phone";
import authService from "services/authService";

export default () => {
  const { npnId } = useParams();
  return (
    <>
      <Helmet>
        <title>MedicareCENTER - Contact Support</title>
      </Helmet>
      <div className="content-frame v2">
        <SimpleHeader />
        <Container size="small">
          <h1 className="hdg hdg--2 mb-3">Something's not right</h1>
          <span className="npn-text">NPN{npnId}</span>
          <p className="text text--secondary mt-1 mb-3">
            The NPN above doesn’t match our registration records. Contact
            support for assistance.
          </p>
          <p className="mb-2 content-center ">
            <MailIcon />
            <a
              href="mailto:support@medicarecenter.com"
              className="ml-2 link link--force-underline"
            >
              support@medicarecenter.com
            </a>
          </p>
          <p className="mb-3 content-center ">
            <PhoneIcon />
            <a
              href="tel:+18888183760"
              className="ml-2 link link--force-underline"
            >
              888-818-3760
            </a>
          </p>
          <p>
            <button
              className="link link--force-underline"
              onClick={authService.requestPasswordReset}
            >
              Try again using a different NPN
            </button>
          </p>
        </Container>
        <SimpleFooter className="global-footer--simple" />
      </div>
    </>
  );
};
