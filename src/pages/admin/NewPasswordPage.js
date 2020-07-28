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
          <h1 className="hdg hdg--2 mb-3">Set a new password</h1>

          <form action="/password-updated" className="form">
            <fieldset className="form__fields">
              <Textfield
                id="new-password"
                type="password"
                label="New Password"
                placeholder="Enter your new password"
              />
              <Textfield
                id="new-password-repeat"
                type="password"
                label="Re-enter New Password"
                placeholder="Re-enter your new password"
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
