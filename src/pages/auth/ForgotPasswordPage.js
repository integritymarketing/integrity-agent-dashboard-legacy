import React from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Formik } from "formik";
import Container from "components/ui/container";
import SimpleHeader from "partials/simple-header";
import SimpleFooter from "partials/simple-footer";
import Textfield from "components/ui/textfield";
import validationService from "services/validationService";
import useLoading from "hooks/useLoading";
import analyticsService from "services/analyticsService";
import authService from "services/authService";

// NOTE that there are instances of both username + npn in this file (they are the same thing)
// this is to handle compatibility with identity server in the short term
// before we fully transition to 'Username' for everything

export default () => {
  const history = useHistory();
  const loading = useLoading();

  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Forgot Password</title>
      </Helmet>
      <div className="content-frame v2">
        <SimpleHeader />
        <Container size="small">
          <h1 className="text-xl mb-2">Reset your password</h1>
          <p className="text text--secondary mb-4">
            Enter your email to reset your password.
          </p>

          <Formik
            initialValues={{ Username: "" }}
            validate={(values) => {
              return validationService.validateMultiple(
                [
                  {
                    name: "Username",
                    validator: validationService.composeValidator([
                      validationService.validateRequired,
                      validationService.validateEmail,
                    ]),
                  },
                ],
                values
              );
            }}
            onSubmit={async (values, { setErrors, setSubmitting }) => {
              setSubmitting(true);
              loading.begin();

              const response = await authService.requestPasswordReset(values);

              setSubmitting(false);
              loading.end();

              // TODO v2: Reconfigure from NPN to email once api changed?
              if (response.status >= 200 && response.status < 300) {
                history.push(`password-reset-sent?npn=${values.Username}`);
                analyticsService.fireEvent("formSubmit", {
                  button: "forgotSubmit",
                  pagePath: window.location.href,
                });
              } else {
                const errorsArr = await response.json();
                let errors = validationService.formikErrorsFor(errorsArr);

                if (errors.Global === "account_unconfirmed") {
                  // TODO v2: Reconfigure from NPN to email once api changed?
                  history.push(
                    `registration-email-sent?npn=${values.Username}&mode=error`
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
                  <Textfield
                    id="forgot-password-username"
                    label="Email Address"
                    placeholder=""
                    name="Username"
                    value={values.Username}
                    onChange={handleChange}
                    onBlur={(e) => {
                      analyticsService.fireEvent("leaveField", {
                        field: "username",
                        formName: "forgot",
                      });
                      return handleBlur(e);
                    }}
                    error={
                      (touched.Username && errors.Username) || errors.Global
                    }
                  />
                  <div className="form__submit">
                    <button className="btn-v2" type="submit">
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
