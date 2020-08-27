import React from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import Container from "components/ui/container";
import GlobalNav from "partials/simple-header";
import SimpleFooter from "partials/simple-footer";
import { InvertedTextfield } from "components/ui/textfield";
import BackLink from "components/ui/back-link";
import validationService from "services/validation";
import useLoading from "hooks/useLoading";

export default () => {
  const history = useHistory();
  const loading = useLoading();

  return (
    <div className="content-frame bg-photo bg-img-fixed text-invert">
      <GlobalNav />
      <Container size="small">
        <BackLink component={Link} to="/login">
          Back to Login
        </BackLink>
        <h1 className="hdg hdg--2 mb-1 mt-1">Forgot your password?</h1>
        <p className="text-body mb-4">
          Enter your email address below and if an account is associated with it
          we will send you a reset link.
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

            setSubmitting(false);
            loading.end();

            if (response.status >= 200 && response.status < 300) {
              history.push(`password-reset-sent?npn=${values.NPN}`);
            } else {
              const errorsArr = await response.json();
              setErrors(validationService.formikErrorsFor(errorsArr));
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
                  placeholder="Enter your NPN Number"
                  name="NPN"
                  value={values.NPN}
                  onChange={handleChange}
                  onBlur={handleBlur}
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
  );
};
