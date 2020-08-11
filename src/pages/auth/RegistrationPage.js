import React from "react";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Container from "components/ui/container";
import PageCard from "components/ui/page-card";
import GlobalNav from "partials/simple-header";
import GlobalFooter from "partials/global-footer";
import Textfield from "components/ui/textfield";
import BackLink from "components/ui/back-link";
import validationService from "services/validation";

export default () => {
  const history = useHistory();

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
          <h1 className="hdg hdg--2 mb-3">Register for an account</h1>

          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              npn: "",
              email: "",
              emailRepeat: "",
              password: "",
              confirmPassword: "",
            }}
            initialErrors={{ global: validationService.getPageErrors() }}
            validate={(values) => {
              return validationService.validateMultiple(
                [
                  {
                    name: "firstName",
                    validator: validationService.validateRequired,
                    args: ["First Name"],
                  },
                  {
                    name: "lastName",
                    validator: validationService.validateRequired,
                    args: ["Last Name"],
                  },
                  {
                    name: "npn",
                    validator: validationService.validateNPN,
                  },
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
                  {
                    name: "password",
                    validator: validationService.validatePasswordCreation,
                  },
                  {
                    name: "confirmPassword",
                    validator: validationService.validateFieldMatch(
                      values.password
                    ),
                  },
                ],
                values
              );
            }}
            onSubmit={async (values, { setErrors, setSubmitting }) => {
              setSubmitting(true);

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

              if (response.status >= 200 && response.status < 300) {
                history.push(`registration-check-email?npn=${values.npn}`);
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
                    id="register-fname"
                    label="First Name"
                    placeholder="Enter your first name"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      (touched.firstName && errors.firstName) || errors.global
                    }
                  />
                  <Textfield
                    id="register-lname"
                    label="Last Name"
                    placeholder="Enter your last name"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      (touched.lastName && errors.lastName) || errors.global
                    }
                  />
                  <Textfield
                    id="register-npn"
                    label="NPN Number"
                    placeholder="Enter your NPN Number"
                    name="npn"
                    value={values.npn}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={(touched.npn && errors.npn) || errors.global}
                  />
                  <Textfield
                    id="register-email"
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email address"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={(touched.email && errors.email) || errors.global}
                  />
                  <Textfield
                    id="register-email-verify"
                    type="email"
                    label="Re-enter Email Address"
                    placeholder="Re-enter your email address"
                    name="emailRepeat"
                    value={values.emailRepeat}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      (touched.emailRepeat && errors.emailRepeat) ||
                      errors.global
                    }
                  />
                  <Textfield
                    id="register-password"
                    type="password"
                    label="Create Password"
                    placeholder="Create a new password"
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
                          <li>
                            Include at least one non-alphanumeric character
                          </li>
                        </ul>
                      </div>
                    }
                    focusBannerVisible={!!errors.password}
                  />
                  <Textfield
                    id="register-password-verify"
                    type="password"
                    label="Re-enter Password"
                    placeholder="Re-enter your new password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      (touched.confirmPassword && errors.confirmPassword) ||
                      errors.global
                    }
                    success={
                      touched.confirmPassword &&
                      !errors.confirmPassword &&
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
