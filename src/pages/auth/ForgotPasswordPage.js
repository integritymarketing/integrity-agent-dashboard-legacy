import React from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import Container from "components/ui/container";
import PageCard from "components/ui/page-card";
import GlobalNav from "partials/simple-header";
import GlobalFooter from "partials/global-footer";
import Textfield from "components/ui/textfield";
import BackLink from "components/ui/back-link";
import validationService from "services/validation";
import useLoading from "hooks/useLoading";

export default () => {
  const history = useHistory();
  const loading = useLoading();

  return (
    <div className="content-frame bg-admin text-muted">
      <GlobalNav />
      <Container size="small">
        <PageCard
          link={
            <BackLink component={Link} to="/">
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
            initialValues={{ npn: "" }}
            validate={(values) => {
              const errors = {};
              let npnErr = validationService.validateNPN(values.npn);
              if (npnErr) {
                errors.npn = npnErr;
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
                history.push(`password-reset-sent?npn=${values.npn}`);
              } else {
                const data = await response.json();
                setErrors(data);
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
                    id="forgot-password-npn"
                    label="NPN Number"
                    placeholder="Enter your npn Number"
                    name="npn"
                    value={values.npn}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={(touched.npn && errors.npn) || errors.global}
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
