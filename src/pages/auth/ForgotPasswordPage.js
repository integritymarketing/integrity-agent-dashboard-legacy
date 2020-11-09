import React from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Formik } from "formik";
import Container from "components/ui/container";
import GlobalNav from "partials/simple-header";
import SimpleFooter from "partials/simple-footer";
import { InvertedTextfield } from "components/ui/textfield";
import BackLink from "components/ui/back-link";
import validationService from "services/validationService";
import useLoading from "hooks/useLoading";
import NumberIcon from "components/icons/number";
import analyticsService from "services/analyticsService";
import authService from "services/authService";

export default () => {
  const history = useHistory();
  const loading = useLoading();

  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Forgot Password</title>
      </Helmet>
      <div className="content-frame bg-photo bg-img-fixed text-invert">
        <GlobalNav />
        <Container size="small">
          <BackLink
            component={Link}
            onClick={authService.redirectAndRestartLoginFlow}
          >
            Back to Login
          </BackLink>
          <h1 className="hdg hdg--2 mb-1 mt-3">Forgot your password?</h1>
          <p className="text-body mb-4">
            Enter your NPN number below and if an account is associated with it
            we will send a reset link to your email.
          </p>

          <Formik
            initialValues={{ NPN: "" }}
            validate={(values) => {
              const errors = {};
              let npnErr = validationService.validateNPN(values.NPN);
              if (npnErr) {
                errors.NPN = npnErr;
              }
              return errors;
            }}
            onSubmit={async (values, { setErrors, setSubmitting }) => {
              setSubmitting(true);
              loading.begin();

              const response = await authService.requestPasswordReset(values);

              setSubmitting(false);
              loading.end();

              if (response.status >= 200 && response.status < 300) {
                history.push(`password-reset-sent?npn=${values.NPN}`);
                analyticsService.fireEvent("formSubmit", {
                  button: "forgotSubmit",
                  pagePath: window.location.href,
                });
              } else {
                const errorsArr = await response.json();
                let errors = validationService.formikErrorsFor(errorsArr);

                if (errors.Global === "account_unconfirmed") {
                  history.push(
                    `registration-email-sent?npn=${values.NPN}&mode=error`
                  );
                } else {
                  setErrors(errors);
                }
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
                    id="forgot-password-npn"
                    label="NPN Number"
                    icon={<NumberIcon />}
                    placeholder="Enter your NPN Number"
                    name="NPN"
                    value={values.NPN}
                    onChange={handleChange}
                    onBlur={(e) => {
                      analyticsService.fireEvent("leaveField", {
                        field: "npn",
                        formName: "forgot",
                      });
                      return handleBlur(e);
                    }}
                    error={(touched.NPN && errors.NPN) || errors.Global}
                  />
                  <div className="form__submit">
                    <button className="btn btn--invert" type="submit">
                      Submit
                    </button>
                  </div>
                </fieldset>
              </form>
            )}
          </Formik>
        </Container>
        <SimpleFooter />
      </div>
    </React.Fragment>
  );
};
