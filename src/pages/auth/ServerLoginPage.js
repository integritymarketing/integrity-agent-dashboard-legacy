import React from "react";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import Container from "components/ui/container";
import PageCard from "components/ui/page-card";
import GlobalNav from "partials/simple-header";
import SimpleFooter from "partials/simple-footer";
import { InvertedTextfield } from "components/ui/textfield";
import validationService from "services/validation";
import useLoading from "hooks/useLoading";
import { useHistory } from "react-router-dom";
import useParams from "hooks/useParams";

export default () => {
  const loading = useLoading();
  const history = useHistory();
  const params = useParams();

  return (
    <div className="content-frame bg-photo text-invert">
      <GlobalNav />
      <Container size="small">
        <h1 className="hdg hdg--2 mb-4">Login to your account</h1>

        <Formik
          initialValues={{ NPN: "", Password: "" }}
          validate={(values) => {
            return validationService.validateMultiple(
              [
                {
                  name: "NPN",
                  validator: validationService.validateNPN,
                },
                {
                  name: "Password",
                  validator: validationService.validatePasswordAccess,
                },
              ],
              values
            );
          }}
          onSubmit={async (values, { setErrors, setSubmitting }) => {
            setSubmitting(true);
            loading.begin();
            values.returnUrl = params.get("ReturnUrl");

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
                NPN: " ",
                Password:
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
                <InvertedTextfield
                  id="login-npn"
                  label="NPN Number"
                  placeholder="Enter your NPN Number"
                  name="NPN"
                  value={values.NPN}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={(touched.NPN && errors.NPN) || errors.Global}
                />
                <InvertedTextfield
                  id="login-password"
                  type="password"
                  label="Password"
                  placeholder="Enter your Password"
                  name="Password"
                  value={values.Password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={(touched.Password && errors.Password) || errors.Global}
                  auxLink={
                    <Link
                      to="/forgot-password"
                      className="link link--invert link--force-underline"
                    >
                      Forgot Password?
                    </Link>
                  }
                />
                <div className="form__submit">
                  <button className="btn btn--invert" type="submit">
                    Login
                  </button>
                </div>
                <div>
                  <Link
                    to="/register"
                    className="link link--invert link--force-underline"
                  >
                    Setting up a new account?
                  </Link>
                </div>
              </fieldset>
            </form>
          )}
        </Formik>
      </Container>
      <SimpleFooter />
    </div>
  );
};
