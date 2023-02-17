import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { HeaderUnAuthenticated } from "components/HeaderUnAuthenticated";
import { FooterUnAuthenticated } from "components/FooterUnAuthenticated";
import { ContainerUnAuthenticated } from "components/ContainerUnAuthenticated";
import MailIcon from "components/icons/v2-mail";
import PhoneIcon from "components/icons/v2-phone";

export default () => {
  const { npnId } = useParams();
  const history = useHistory();
  const goToForgotPassword = () => {
    history.push(`/forgot-password`);
  };
  return (
    <>
      <Helmet>
        <title>MedicareCENTER - Contact Support</title>
      </Helmet>
      <div className="content-frame v2">
        <HeaderUnAuthenticated />
        <ContainerUnAuthenticated>
          <h1 className="hdg hdg--2 mb-3">Something's not right</h1>
          <span className="npn-text">{npnId}</span>
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
              onClick={goToForgotPassword}
            >
              Try again using a different NPN
            </button>
          </p>
        </ContainerUnAuthenticated>
        <FooterUnAuthenticated />
      </div>
    </>
  );
};
