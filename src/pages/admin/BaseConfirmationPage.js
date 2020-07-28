import React from "react";
import { Link } from "react-router-dom";
import Container from "components/ui/container";
import PageCard from "components/ui/page-card";
import GlobalNav from "partials/simple-header";
import GlobalFooter from "partials/global-footer";

const defaultButton = () => (
  <Link to="/login" className="btn">
    Back to Login
  </Link>
);

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
