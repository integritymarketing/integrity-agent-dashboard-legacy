import React from "react";
import Container from "components/ui/container";
import { Formik } from "formik";
import GlobalNav from "partials/global-nav";
import GlobalFooter from "partials/global-footer";
import useUserProfile from "hooks/useUserProfile";
import Textfield from "components/ui/textfield";
import validationService from "services/validation";
import useFlashMessage from "hooks/useFlashMessage";

export default () => {
  const userProfile = useUserProfile();
  const { firstName, lastName, npn, email } = userProfile;
  const { show: showMessage } = useFlashMessage();

  return (
    <React.Fragment>
      <div className="bg-high-contrast">
        <GlobalNav />
        <Container className="scaling-header">
          <div className="hdg hdg--2">Update your account information</div>
        </Container>
      </div>
      {userProfile.id && (
        <Container className="mt-scale-3">
          <section>
            <div className="hdg hdg--3">Your account info</div>
            <Formik
              initialValues={{
                firstName,
                lastName,
                npn,
                email,
              }}
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
                      name: "email",
                      validator: validationService.validateEmail,
                    },
                  ],
                  values
                );
              }}
              onSubmit={async (values, { setSubmitting }) => {
                showMessage("Your account info has been updated.", {
                  type: "success",
                });
                setSubmitting(false);
                // TODO: hook up form submit
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
                <form action="" className="form mt-3" onSubmit={handleSubmit}>
                  <fieldset className="form__fields form__fields--constrained">
                    <Textfield
                      id="account-fname"
                      label="First Name"
                      placeholder={"Enter your first name"}
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.firstName && errors.firstName}
                    />
                    <Textfield
                      id="account-lname"
                      label="Last Name"
                      placeholder="Enter your last name"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.lastName && errors.lastName}
                    />
                    <Textfield
                      id="account-npn"
                      label="NPN Number"
                      placeholder="Enter your NPN Number"
                      name="npn"
                      value={values.npn}
                      readOnly
                    />
                    <Textfield
                      id="account-email"
                      type="email"
                      label="Email Address"
                      placeholder="Enter your email address"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && errors.email}
                    />
                    <div className="form__submit">
                      <button className="btn" type="submit">
                        Save
                      </button>
                    </div>
                  </fieldset>
                </form>
              )}
            </Formik>
          </section>
          <section className="mt-5">
            <div className="hdg hdg--3">Update your password</div>
            <Formik
              initialValues={{
                currentPassword: "",
                password: "",
                confirmPassword: "",
              }}
              validate={(values) => {
                return validationService.validateMultiple(
                  [
                    {
                      name: "currentPassword",
                      validator: validationService.validateRequired,
                      args: ["Current Password"],
                    },
                    {
                      name: "password",
                      validator: validationService.validatePasswordCreation,
                      args: ["New Password"],
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
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                // TODO: hook up form submit
                showMessage("Your password has been updated.");
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
                <form action="" className="form mt-3" onSubmit={handleSubmit}>
                  <fieldset className="form__fields form__fields--constrained">
                    <Textfield
                      id="account-password-current"
                      type="password"
                      label="Current Password"
                      placeholder="Enter your current password"
                      name="currentPassword"
                      value={values.currentPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.currentPassword && errors.currentPassword}
                      success={
                        touched.currentPassword && !errors.currentPassword
                      }
                    />
                    <Textfield
                      id="account-password"
                      type="password"
                      label="Create New Password"
                      placeholder="Create a new password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && errors.password}
                      success={touched.password && !errors.password}
                      focusBanner={
                        <div className="form-tip">
                          <p>Your password must: </p>
                          <ul className="list-basic">
                            <li>Be at least 8 characters long</li>
                            <li>
                              Include at least one uppercase and lowercase
                              letter
                            </li>
                            <li>Include at least one number</li>
                          </ul>
                        </div>
                      }
                      focusBannerVisible={!!errors.password}
                    />
                    <Textfield
                      id="account-password-verify"
                      type="password"
                      label="Re-enter New Password"
                      placeholder="Re-enter your new password"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.confirmPassword && errors.confirmPassword}
                      success={
                        touched.confirmPassword && !errors.confirmPassword
                      }
                    />
                    <div className="form__submit">
                      <button className="btn" type="submit">
                        Save
                      </button>
                    </div>
                  </fieldset>
                </form>
              )}
            </Formik>
          </section>
        </Container>
      )}
      <GlobalFooter />
    </React.Fragment>
  );
};
