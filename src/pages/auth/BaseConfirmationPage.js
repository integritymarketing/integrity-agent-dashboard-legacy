import React from "react";
import Container from "components/ui/container";
import PageCard from "components/ui/page-card";
import GlobalNav from "partials/simple-header";
import GlobalFooter from "partials/global-footer";

const defaultButton = () => {
  const redirectAndRestartLoginFlow = () => {
    window.location = process.env.REACT_APP_PORTAL_URL;
  };

  return (
    <button className="btn" onClick={redirectAndRestartLoginFlow}>
      Back to Login
    </button>
  );
};

export default ({ footer, title, body = null, button = defaultButton() }) => {
  return (
    <div className="content-frame bg-admin text-muted">
      <GlobalNav />
      <Container size="small">
        <PageCard footer={footer}>
          <div className="text-center">
            <h1 className="hdg hdg--2 mb-1">{title}</h1>
            {body && <p className="text-body mb-4">{body}</p>}

            <div>{button}</div>
          </div>
        </PageCard>
      </Container>
      <GlobalFooter className="global-footer--simple" />
    </div>
  );
};
