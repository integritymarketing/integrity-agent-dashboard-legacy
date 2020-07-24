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
          <h1 className="hdg hdg--2 mb-3">Register for an account</h1>

          <form action="" className="form">
            <fieldset className="form__fields">
              <Textfield
                id="register-fname"
                label="First Name"
                placeholder="Enter your first name"
              />
              <Textfield
                id="register-lname"
                label="Last Name"
                placeholder="Enter your last name"
              />
              <Textfield
                id="register-npn"
                label="NPN Number"
                placeholder="Enter your NPN Number"
              />
              <Textfield
                id="register-email"
                type="email"
                label="Email Address"
                placeholder="Enter your email address"
              />
              <Textfield
                id="register-email-verify"
                type="email"
                label="Re-enter Email Address"
                placeholder="Re-enter your email address"
              />
              <Textfield
                id="register-password"
                type="password"
                label="Create Password"
                placeholder="Create a new password"
              />
              <Textfield
                id="register-password-verify"
                type="password"
                label="Re-enter Password"
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
