import React from "react";
import { Link } from "react-router-dom";
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
          <h1 className="hdg hdg--2 mb-3">Login to your account</h1>

          <form action="" className="form">
            <fieldset className="form__fields">
              <Textfield
                id="login-npn"
                label="NPN Number"
                placeholder="Enter your NPN Number"
              />
              <Textfield
                id="login-password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                auxLink={
                  <span className="text-muted">
                    <Link to="/forgot-password" className="link link--inherit">
                      Forgot Password?
                    </Link>
                  </span>
                }
              />
              <div className="form__submit">
                <button className="btn" type="submit">
                  Login
                </button>
              </div>
              <div>
                <Link to="/register" className="link">
                  Setting up a new account?
                </Link>
              </div>
            </fieldset>
          </form>
        </PageCard>
      </Container>
      <GlobalFooter className="global-footer--simple" />
    </div>
  );
};
