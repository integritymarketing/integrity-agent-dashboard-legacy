import React from "react";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import Container from "components/ui/container";
import PageCard from "components/ui/page-card";
import GlobalNav from "partials/simple-header";
import GlobalFooter from "partials/global-footer";
import Textfield from "components/ui/textfield";
import validationService from "services/validation";
import useLoading from "hooks/useLoading";
import { useHistory } from "react-router-dom";

const getQueryVariable = (queryVariable) => {
  let searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(queryVariable);
};

export default () => {
  const loading = useLoading();
  const history = useHistory();

  return (
    <div className="content-frame bg-admin text-muted">
      <GlobalNav />
      <Container size="small">
        <PageCard>
          <h1 className="hdg hdg--2 mb-3">Login to your account</h1>

          <Formik
            initialValues={{ npn: "", password: "" }}
            initialErrors={{ global: validationService.getPageErrors() }}
            validate={(values) => {
              return validationService.validateMultiple(
                [
                  {
                    name: "npn",
                    validator: validationService.validateNPN,
                  },
                  {
                    name: "password",
                    validator: validationService.validatePasswordAccess,
                  },
                ],
                values
              );
            }}
            onSubmit={async (values, { setErrors, setSubmitting }) => {
              setSubmitting(true);
              loading.begin();
              values.returnUrl = getQueryVariable("ReturnUrl");

              const response = await fetch(
                process.env.REACT_APP_AUTH_AUTHORITY_URL + "/api/account/login",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify(values),
                }
              );

              // a 500 server error occurs when invalid OIDC query string params
              // are present (eg missing ReturnUrl).
              // catch 500 and send to final error page.
              if (response.status >= 500) {
                history.push(
                  `sorry?message=${encodeURIComponent(
                    "Something went wrong with your login request.  Please try again."
                  )}`
                );
                loading.end();
                return;
              }

              const data = await response.json();
              setSubmitting(false);
              loading.end();

              if (data && data.isOk) {
                window.location = data.redirectUrl;
              } else {
                setErrors({
                  npn: " ",
                  password:
                    "Sorry, we could not log you in at this time.  Please check you credentials and try again.",
                });
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleSubmit,
              handleChange,
              handleBlur,
            }) => (
              <form action="" className="form" onSubmit={handleSubmit}>
                <fieldset className="form__fields">
                  <Textfield
                    id="login-npn"
                    label="NPN Number"
                    placeholder="Enter your NPN Number"
                    name="npn"
                    value={values.npn}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={(touched.npn && errors.npn) || errors.global}
                  />
                  <Textfield
                    id="login-password"
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      (touched.password && errors.password) || errors.global
                    }
                    auxLink={
                      <span className="text-muted">
                        <Link
                          to="/forgot-password"
                          className="link link--inherit"
                        >
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
            )}
          </Formik>
        </PageCard>
      </Container>
      <GlobalFooter className="global-footer--simple" />
    </div>
  );
};
