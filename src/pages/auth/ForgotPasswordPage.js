import React from "react";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import Container from "components/ui/container";
import PageCard from "components/ui/page-card";
import GlobalNav from "partials/simple-header";
import GlobalFooter from "partials/global-footer";
import Textfield from "components/ui/textfield";
import BackLink from "components/ui/back-link";
import validationService from "services/validation";

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
          <p className="text-body mb-4">
            Enter your email address below and if an account is associated with
            it we will send you a reset link.
          </p>

          <Formik
            initialValues={{ username: "" }} // aka npn
            initialErrors={{ global: validationService.getPageErrors() }}
            validate={(values) => {
              const errors = {};
              let usernameErr = validationService.validateNPN(values.username);
              if (usernameErr) {
                errors.username = usernameErr;
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              const response = await fetch(
                process.env.REACT_APP_AUTH_AUTHORITY_URL +
                  "/api/account/forgotpassword",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify(values),
                }
              );

              const data = await response.json();
              setSubmitting(false);
              if (data && data.isOk) {
              } else {
                // handle validation error
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
                    id="forgot-password-username"
                    label="NPN NumberNPN Number"
                    placeholder="Enter your username Number"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      (touched.username && errors.username) || errors.global
                    }
                  />
                  <div className="form__submit">
                    <button className="btn" type="submit">
                      Submit
                    </button>
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
