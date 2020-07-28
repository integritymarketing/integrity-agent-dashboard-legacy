import React from "react";
import Container from "components/ui/container";
import PageCard from "components/ui/page-card";
import GlobalNav from "partials/simple-header";
import GlobalFooter from "partials/global-footer";
import Textfield from "components/ui/textfield";

export default () => {
  return (
    <div className="content-frame bg-admin text-muted">
      <GlobalNav />
      <Container size="small">
        <PageCard>
          <h1 className="hdg hdg--2 mb-3">Update your email address</h1>

          <form action="/email-updated" className="form">
            <fieldset className="form__fields">
              <Textfield
                id="new-email"
                type="email"
                label="Email Address"
                placeholder="Enter your email address"
              />
              <Textfield
                id="new-email-repeat"
                type="email"
                label="Re-enter Email Address"
                placeholder="Re-enter your email address"
              />
              <div className="form__submit">
                <button className="btn" type="submit">
                  Submit
                </button>
              </div>
            </fieldset>
          </form>
        </PageCard>
      </Container>
      <GlobalFooter className="global-footer--simple" />
    </div>
  );
};
