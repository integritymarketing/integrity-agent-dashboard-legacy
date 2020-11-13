import React from "react";
import { Helmet } from "react-helmet-async";
import Container from "components/ui/container";
import { Formik } from "formik";
import GlobalNav from "partials/global-nav";
import GlobalFooter from "partials/global-footer";
import useUserProfile from "hooks/useUserProfile";
import Textfield from "components/ui/textfield";
import validationService from "services/validationService";
import useFlashMessage from "hooks/useFlashMessage";
import useLoading from "hooks/useLoading";
import authService from "services/authService";
import LockIcon from "components/icons/lock";
import NumberIcon from "components/icons/number";
import MailIcon from "components/icons/mail";
import ProfileIcon from "components/icons/profile";
import PhoneIcon from "components/icons/phone";

const formatPhoneNumber = (phoneNumberString) => {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return null;
};

export default () => {
  const userProfile = useUserProfile();
  const { firstName, lastName, npn, email, phone } = userProfile;
  const { show: showMessage } = useFlashMessage();
  const loading = useLoading();

  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Edit Account</title>
      </Helmet>
      <div className="bg-photo text-invert">
        <GlobalNav />
        <Container className="scaling-header">
          <h2 className="hdg hdg--1">Update your account information</h2>
        </Container>
      </div>
      {userProfile.id && (
        <Container className="mt-scale-3">
          <section>
            <h3 className="hdg hdg--3">Your account info</h3>
            <Formik
              initialValues={{
                firstName,
                lastName,
                phone: phone ? formatPhoneNumber(phone) : "",
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
                      name: "phone",
                      validator: validationService.validatePhone,
                    },
                    {
                      name: "email",
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
                loading.begin(0);

                const formattedValues = Object.assign({}, values, {
                  phone: values.phone
                    ? `${values.phone}`.replace(/\D/g, "")
                    : "",
                });

                let response = await authService.updateAccountMetadata(
                  formattedValues
                );
                if (response.status >= 200 && response.status < 300) {
                  // fetch a new access token w/ updated meta
                  await authService.signinSilent();

                  setSubmitting(false);
                  loading.end();

                  showMessage("Your account info has been updated.", {
                    type: "success",
                  });
                } else {
                  loading.end();
                  if (response.status === 401) {
                    authService.handleExpiredToken();
                  } else {
                    const errorsArr = await response.json();
                    setErrors(
                      validationService.formikErrorsFor(
                        validationService.standardizeValidationKeys(errorsArr)
                      )
                    );
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
                <form action="" className="form mt-3" onSubmit={handleSubmit}>
                  <fieldset className="form__fields form__fields--constrained">
                    <Textfield
                      id="account-fname"
                      label="First Name"
                      icon={<ProfileIcon />}
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
                      icon={<ProfileIcon />}
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
                      icon={<NumberIcon />}
                      placeholder="Enter your NPN Number"
                      name="npn"
                      value={values.npn}
                      readOnly
                    />
                    <Textfield
                      id="account-phone"
                      label="Phone Number"
                      icon={<PhoneIcon />}
                      type="tel"
                      placeholder="XXX-XXX-XXXX"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={(touched.phone && errors.phone) || errors.Global}
                    />
                    <Textfield
                      id="account-email"
                      type="email"
                      label="Email Address"
                      icon={<MailIcon />}
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
            <h3 className="hdg hdg--3">Update your password</h3>
            <Formik
              initialValues={{
                currentPassword: "",
                newPassword: "",
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
                      name: "newPassword",
                      validator: validationService.validatePasswordCreation,
                      args: ["New Password"],
                    },
                    {
                      name: "confirmPassword",
                      validator: validationService.validateFieldMatch(
                        values.newPassword
                      ),
                    },
                  ],
                  values
                );
              }}
              onSubmit={async (values, { setErrors, setSubmitting }) => {
                setSubmitting(true);
                loading.begin(0);

                let response = await authService.updateAccountPassword(values);
                if (response.status >= 200 && response.status < 300) {
                  setSubmitting(false);
                  loading.end();

                  showMessage("Your password has been successfully updated.", {
                    type: "success",
                  });
                } else {
                  loading.end();
                  if (response.status === 401) {
                    authService.handleExpiredToken();
                  } else {
                    const errorsArr = await response.json();
                    setErrors(
                      validationService.formikErrorsFor(
                        validationService.standardizeValidationKeys(errorsArr)
                      )
                    );
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
                <form action="" className="form mt-3" onSubmit={handleSubmit}>
                  <fieldset className="form__fields form__fields--constrained">
                    <Textfield
                      id="account-password-current"
                      type="password"
                      label="Current Password"
                      icon={<LockIcon />}
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
                      icon={<LockIcon />}
                      placeholder="Create a new password"
                      name="newPassword"
                      value={values.newPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.newPassword && errors.newPassword}
                      success={touched.newPassword && !errors.newPassword}
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
                            <li>
                              Include at least one non-alphanumeric character
                            </li>
                          </ul>
                        </div>
                      }
                      focusBannerVisible={!!errors.newPassword}
                    />
                    <Textfield
                      id="account-password-verify"
                      type="password"
                      label="Re-enter New Password"
                      icon={<LockIcon />}
                      placeholder="Re-enter your new password"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.confirmPassword && errors.confirmPassword}
                      success={
                        touched.confirmPassword &&
                        !errors.confirmPassword &&
                        !errors.newPassword
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
