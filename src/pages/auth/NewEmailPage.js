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
          <h1 className="hdg hdg--2 mb-3">Update your email address</h1>

          <Formik
            initialValues={{ email: "", emailRepeat: "" }}
            validate={(values) => {
              return validationService.validateMultiple(
                [
                  {
                    name: "email",
                    validator: validationService.validateEmail,
                  },
                  {
                    name: "emailRepeat",
                    validator: validationService.validateFieldMatch(
                      values.email
                    ),
                    args: ["Email Addresses"],
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
                action="/email-updated"
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
                    id="new-email"
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email address"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={(touched.email && errors.email) || errors.Global}
                  />
                  <Textfield
                    id="new-email-repeat"
                    type="email"
                    label="Re-enter Email Address"
                    placeholder="Re-enter your email address"
                    name="emailRepeat"
                    value={values.emailRepeat}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      (touched.emailRepeat && errors.emailRepeat) ||
                      errors.Global
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
