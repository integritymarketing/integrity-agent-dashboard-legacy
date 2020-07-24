import React from "react";
import { Link } from "react-router-dom";
import Container from "components/ui/container";
import PageCard from "components/ui/page-card";
import GlobalNav from "partials/simple-header";
import GlobalFooter from "partials/global-footer";
import Textfield from "components/ui/textfield";
import BackLink from "components/ui/back-link";

export default () => {
  return (
    <div className="content-frame bg-admin text-muted">
      <GlobalNav />
      <Container size="small">
        <PageCard
          link={
            <BackLink component={Link} to="/login">
              Back to Login
            </BackLink>
          }
        >
          <h1 className="hdg hdg--2 mb-1">Forgot your password?</h1>
          <p className="mb-4">
            Enter your email address below and if an account is associated with
            it we will send you a reset link.
          </p>

          <form action="" className="form">
            <fieldset className="form__fields">
              <Textfield
                id="forgot-password-npn"
                label="NPN Number"
                placeholder="Enter your NPN Number"
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
