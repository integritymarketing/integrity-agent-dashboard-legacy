import React from "react";
import { Formik } from "formik";
import Container from "components/ui/container";
import PageCard from "components/ui/page-card";
import GlobalNav from "partials/simple-header";
import GlobalFooter from "partials/global-footer";
import Textfield from "components/ui/textfield";
import validationService from "services/validation";

export default () => {
  return (
    <div className="content-frame bg-admin text-muted">
      <GlobalNav />
      <Container size="small">
        <PageCard>
          <h1 className="hdg hdg--2 mb-3">Set a new password</h1>

          <Formik
            initialValues={{ password: "", passwordRepeat: "" }}
            initialErrors={{ global: validationService.getPageErrors() }}
            validate={(values) => {
              return validationService.validateMultiple(
                [
                  {
                    name: "password",
                    validator: validationService.validatePasswordCreation,
                  },
                  {
                    name: "passwordRepeat",
                    validator: validationService.validateFieldMatch(
                      values.password
                    ),
                  },
                ],
                values
              );
            }}
            onSubmit={(values, { setSubmitting, submitForm }) => {
              setSubmitting(false);
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
              <form
                action="/password-updated"
                className="form"
                onSubmit={(e) => {
                  // get around e.preventDefault to submit form natively
                  if (Object.keys(errors).length) {
                    handleSubmit(e);
                  }
                }}
              >
                <fieldset className="form__fields">
                  <Textfield
                    id="new-password"
                    type="password"
                    label="New Password"
                    placeholder="Enter your new password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      (touched.password && errors.password) || errors.global
                    }
                    success={
                      touched.password && !errors.password && !errors.global
                    }
                    focusBanner={
                      <div className="form-tip">
                        <p>Your password must: </p>
                        <ul className="list-basic">
                          <li>Be at least 8 characters long</li>
                          <li>
                            Include at least one uppercase and lowercase letter
                          </li>
                          <li>Include at least one number</li>
                        </ul>
                      </div>
                    }
                    focusBannerVisible={!!errors.password}
                  />
                  <Textfield
                    id="new-password-repeat"
                    type="password"
                    label="Re-enter New Password"
                    placeholder="Re-enter your new password"
                    name="passwordRepeat"
                    value={values.passwordRepeat}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      (touched.passwordRepeat && errors.passwordRepeat) ||
                      errors.global
                    }
                    success={
                      touched.passwordRepeat &&
                      !errors.passwordRepeat &&
                      !errors.global
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
