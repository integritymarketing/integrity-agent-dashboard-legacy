import React from "react";
import Container from "components/ui/container";
import SimpleHeader from "partials/simple-header";
import SimpleFooter from "partials/simple-footer";
import authService from "services/authService";

const defaultButton = () => {
  return (
    <button
      className="btn-v2"
      onClick={authService.redirectAndRestartLoginFlow}
    >
      Back to Login
    </button>
  );
};

export default ({ footer, title, body = null, button = defaultButton() }) => {
  return (
    <div className="content-frame v2">
      <SimpleHeader />
      <Container size="small">
        {title && <h1 className="hdg hdg--2 mb-1">{title}</h1>}
        {body && <div className="text-body mb-4">{body}</div>}

        {button && <div>{button}</div>}
        {footer}
      </Container>
      <SimpleFooter className="global-footer--simple" />
    </div>
  );
};
