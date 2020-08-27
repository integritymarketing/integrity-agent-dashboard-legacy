import React from "react";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
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
        <h1 className="hdg hdg--2 mb-3 mt-1">Register for an account</h1>

        <Formik
          initialValues={{
            FirstName: "",
            LastName: "",
            NPN: "",
            Email: "",
            EmailRepeat: "",
            Password: "",
            ConfirmPassword: "",
          }}
          validate={(values) => {
            return validationService.validateMultiple(
              [
                {
                  name: "FirstName",
                  validator: validationService.validateRequired,
                  args: ["First Name"],
                },
                {
                  name: "LastName",
                  validator: validationService.validateRequired,
                  args: ["Last Name"],
                },
                {
                  name: "NPN",
                  validator: validationService.validateNPN,
                },
                {
                  name: "Email",
                  validator: validationService.validateEmail,
                },
                {
                  name: "EmailRepeat",
                  validator: validationService.validateFieldMatch(values.Email),
                  args: ["Email Addresses"],
                },
                {
                  name: "Password",
                  validator: validationService.validatePasswordCreation,
                },
                {
                  name: "ConfirmPassword",
                  validator: validationService.validateFieldMatch(
                    values.Password
                  ),
                },
              ],
              values
            );
          }}
          onSubmit={async (values, { setErrors, setSubmitting }) => {
            setSubmitting(true);
            loading.begin();

            const response = await fetch(
              process.env.REACT_APP_AUTH_AUTHORITY_URL +
                "/api/account/register",
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
              history.push(`registration-check-email?npn=${values.NPN}`);
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
                  id="register-fname"
                  label="First Name"
                  placeholder="Enter your first name"
                  name="FirstName"
                  value={values.FirstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    (touched.FirstName && errors.FirstName) || errors.Global
                  }
                />
                <InvertedTextfield
                  id="register-lname"
                  label="Last Name"
                  placeholder="Enter your last name"
                  name="LastName"
                  value={values.LastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={(touched.LastName && errors.LastName) || errors.Global}
                />
                <InvertedTextfield
                  id="register-npn"
                  label="NPN Number"
                  placeholder="Enter your NPN Number"
                  name="NPN"
                  value={values.NPN}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={(touched.NPN && errors.NPN) || errors.Global}
                />
                <InvertedTextfield
                  id="register-email"
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email address"
                  name="Email"
                  value={values.Email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={(touched.Email && errors.Email) || errors.Global}
                />
                <InvertedTextfield
                  id="register-email-verify"
                  type="email"
                  label="Re-enter Email Address"
                  placeholder="Re-enter your Email address"
                  name="EmailRepeat"
                  value={values.EmailRepeat}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    (touched.EmailRepeat && errors.EmailRepeat) || errors.Global
                  }
                />
                <InvertedTextfield
                  id="register-password"
                  type="password"
                  label="Create Password"
                  placeholder="Create a new Password"
                  name="Password"
                  value={values.Password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={(touched.Password && errors.Password) || errors.Global}
                  success={
                    touched.Password && !errors.Password && !errors.Global
                  }
                  focusBanner={
                    <div className="form-tip">
                      <p>Your Password must: </p>
                      <ul className="list-basic">
                        <li>Be at least 8 characters long</li>
                        <li>
                          Include at least one uppercase and lowercase letter
                        </li>
                        <li>Include at least one number</li>
                        <li>Include at least one non-alphanumeric character</li>
                      </ul>
                    </div>
                  }
                  focusBannerVisible={!!errors.Password}
                />
                <InvertedTextfield
                  id="register-password-verify"
                  type="password"
                  label="Re-enter Password"
                  placeholder="Re-enter your new password"
                  name="ConfirmPassword"
                  value={values.ConfirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    (touched.ConfirmPassword && errors.ConfirmPassword) ||
                    errors.Global
                  }
                  success={
                    touched.ConfirmPassword &&
                    !errors.ConfirmPassword &&
                    !errors.Global
                  }
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
