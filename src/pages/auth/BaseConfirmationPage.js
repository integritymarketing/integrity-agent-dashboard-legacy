import React from "react";
import authService from "services/authService";
import useClientId from "hooks/auth/useClientId";
import { HeaderUnAuthenticated } from "components/HeaderUnAuthenticated";
import { FooterUnAuthenticated } from "components/FooterUnAuthenticated";
import { ContainerUnAuthenticated } from "components/ContainerUnAuthenticated";
import { Button } from "packages/Button";

const defaultButton = () => {
  return (
    <Button size="large" onClick={authService.redirectAndRestartLoginFlow}>
      Back to Login
    </Button>
  );
};

export default ({ footer, title, body = null, button = defaultButton() }) => {
  const clientId = useClientId();

  return (
    <div className="content-frame v2">
      <HeaderUnAuthenticated />
      <ContainerUnAuthenticated>
        {title && <h1 className="hdg hdg--2 mb-1">{title}</h1>}
        {body && <div className="text-body mb-4">{body}</div>}
        {button && clientId !== "ILSClient" && <div>{button}</div>}
        {footer}
      </ContainerUnAuthenticated>
      <FooterUnAuthenticated />
    </div>
  );
};
