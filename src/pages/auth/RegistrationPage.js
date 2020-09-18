import React from "react";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Container from "components/ui/container";
import GlobalNav from "partials/simple-header";
import SimpleFooter from "partials/simple-footer";
import { InvertedTextfield } from "components/ui/textfield";
import BackLink from "components/ui/back-link";
import validationService from "services/validationService";
import useLoading from "hooks/useLoading";
import NumberIcon from "components/icons/number";
import LockIcon from "components/icons/lock";
import MailIcon from "components/icons/mail";
import ProfileIcon from "components/icons/profile";
import analyticsService from "services/analyticsService";
import authService from "services/authService";

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
        <h1 className="hdg hdg--2 mb-3 mt-3">Register for an account</h1>

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
                  validator: validationService.validateRequired,
                  args: ["NPN Number"],
                },
                {
                  name: "Email",
                  validator: validationService.composeValidator([
                    validationService.validateRequired,
                    validationService.validateEmail,
                  ]),
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

            const response = await authService.registerUser(values);

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
                  icon={<ProfileIcon />}
                  placeholder="Enter your first name"
                  name="FirstName"
                  value={values.FirstName}
                  onChange={handleChange}
                  onBlur={(e) => {
                    analyticsService.fireEvent("leaveField", {
                      field: "firstName",
                      formName: "registration",
                    });
                    return handleBlur(e);
                  }}
                  error={
                    (touched.FirstName && errors.FirstName) || errors.Global
                  }
                />
                <InvertedTextfield
                  id="register-lname"
                  label="Last Name"
                  icon={<ProfileIcon />}
                  placeholder="Enter your last name"
                  name="LastName"
                  value={values.LastName}
                  onChange={handleChange}
                  onBlur={(e) => {
                    analyticsService.fireEvent("leaveField", {
                      field: "lastName",
                      formName: "registration",
                    });
                    return handleBlur(e);
                  }}
                  error={(touched.LastName && errors.LastName) || errors.Global}
                />
                <InvertedTextfield
                  id="register-npn"
                  label="NPN Number"
                  icon={<NumberIcon />}
                  placeholder="Enter your NPN Number"
                  name="NPN"
                  value={values.NPN}
                  onChange={handleChange}
                  onBlur={(e) => {
                    analyticsService.fireEvent("leaveField", {
                      field: "npn",
                      formName: "registration",
                    });
                    return handleBlur(e);
                  }}
                  error={(touched.NPN && errors.NPN) || errors.Global}
                />
                <InvertedTextfield
                  id="register-email"
                  type="email"
                  label="Email Address"
                  icon={<MailIcon />}
                  placeholder="Enter your email address"
                  name="Email"
                  value={values.Email}
                  onChange={handleChange}
                  onBlur={(e) => {
                    analyticsService.fireEvent("leaveField", {
                      field: "emailAddress",
                      formName: "registration",
                    });
                    return handleBlur(e);
                  }}
                  error={(touched.Email && errors.Email) || errors.Global}
                />
                <InvertedTextfield
                  id="register-email-verify"
                  type="email"
                  label="Re-enter Email Address"
                  icon={<MailIcon />}
                  placeholder="Re-enter your email address"
                  name="EmailRepeat"
                  value={values.EmailRepeat}
                  onChange={handleChange}
                  onBlur={(e) => {
                    analyticsService.fireEvent("leaveField", {
                      field: "verifyEmailAddress",
                      formName: "registration",
                    });
                    return handleBlur(e);
                  }}
                  error={
                    (touched.EmailRepeat && errors.EmailRepeat) || errors.Global
                  }
                />
                <InvertedTextfield
                  id="register-password"
                  type="password"
                  label="Create Password"
                  icon={<LockIcon />}
                  placeholder="Create a new password"
                  name="Password"
                  value={values.Password}
                  onChange={handleChange}
                  onBlur={(e) => {
                    analyticsService.fireEvent("leaveField", {
                      field: "password",
                      formName: "registration",
                    });
                    return handleBlur(e);
                  }}
                  error={(touched.Password && errors.Password) || errors.Global}
                  success={
                    touched.Password && !errors.Password && !errors.Global
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
                  icon={<LockIcon />}
                  placeholder="Re-enter your new password"
                  name="ConfirmPassword"
                  value={values.ConfirmPassword}
                  onChange={handleChange}
                  onBlur={(e) => {
                    analyticsService.fireEvent("leaveField", {
                      field: "verifyPassword",
                      formName: "registration",
                    });
                    return handleBlur(e);
                  }}
                  error={
                    (touched.ConfirmPassword && errors.ConfirmPassword) ||
                    errors.Global
                  }
                  success={
                    touched.ConfirmPassword &&
                    !errors.ConfirmPassword &&
                    !errors.Global &&
                    !errors.Password
                  }
                />
                <div className="form__submit">
                  <button
                    className={`btn btn--invert ${analyticsService.clickClass(
                      "registration-submit"
                    )}`}
                    type="submit"
                  >
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
