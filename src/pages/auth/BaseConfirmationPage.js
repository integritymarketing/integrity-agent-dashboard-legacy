import React from "react";
import Container from "components/ui/container";
import GlobalNav from "partials/simple-header";
import SimpleFooter from "partials/simple-footer";
import AuthService from "services/auth";

const defaultButton = () => {
  return (
    <button
      className="btn btn--invert"
      onClick={AuthService.redirectAndRestartLoginFlow}
    >
      Back to Login
    </button>
  );
};

export default ({ footer, title, body = null, button = defaultButton() }) => {
  return (
    <div className="content-frame bg-photo bg-img-fixed text-invert">
      <GlobalNav />
      <Container size="small">
        <h1 className="hdg hdg--2 mb-1">{title}</h1>
        {body && <p className="text-body mb-4">{body}</p>}

        <div>{button}</div>
        {footer}
      </Container>
      <SimpleFooter className="global-footer--simple" />
    </div>
  );
};
