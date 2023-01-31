import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Formik } from "formik";
import { useHistory } from "react-router-dom";
import Container from "components/ui/container";
import SimpleHeader from "partials/simple-header";
import SimpleFooter from "partials/simple-footer";
import Textfield from "components/ui/textfield";
import validationService from "services/validationService";
import useLoading from "hooks/useLoading";
import useClientId from "hooks/auth/useClientId";
import analyticsService from "services/analyticsService";
import authService from "services/authService";
import useQueryParams from "hooks/useQueryParams";
import useToast from "../../hooks/useToast";
import Styles from "./AuthPages.module.scss";
import * as Sentry from "@sentry/react";
import AuthContext from "../../contexts/auth";
import useFlashMessage from "../../hooks/useFlashMessage";
import "./mobileStyle.scss";

export default () => {
  const history = useHistory();
  const loading = useLoading();
  const params = useQueryParams();
  const clientId = useClientId();
  const addToast = useToast();
  const auth = useContext(AuthContext);
  const { show: showMessage } = useFlashMessage();
  const [hasNPN] = useState(params.get("npn"));
  const [hasEmail] = useState(params.get("email"));
  useEffect(() => {
    analyticsService.fireEvent("event-content-load", {
      pagePath: "/register/account-registration-form/",
    });
  }, []);
  async function login() {
    try {
      auth.signinRedirect();
    } catch (e) {
      Sentry.captureException(e);
      console.error("sign in error: ", e);
      showMessage("Unable to sign in at this time.", { type: "error" });
    }
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Register Account</title>
      </Helmet>
      <div className="content-frame v2 override">
        <SimpleHeader />
        <Container
          size="full"
          className="background-image flex-fill-space mt-3"
        >
          <h1 className="centered-flex font-32 text-navyblue mb-2">
            Register your account
          </h1>
          <div className="layout-sm">
            <Formik
              initialValues={{
                FirstName: "",
                LastName: "",
                NPN: hasNPN || "",
                Phone: "",
                Email: hasEmail || "",
                Password: "",
              }}
              validate={(values) => {
                return validationService.validateMultiple(
                  [
                    {
                      name: "NPN",
                      validator: hasNPN
                        ? validationService.validateUsername
                        : () => null,
                      args: ["NPN Number"],
                    },
                    {
                      name: "FirstName",
                      validator: validationService.validateOnlyAlphabetics,
                      args: ["First Name"],
                    },
                    {
                      name: "LastName",
                      validator: validationService.validateOnlyAlphabetics,
                      args: ["Last Name"],
                    },
                    {
                      name: "Phone",
                      validator: validationService.composeValidator([
                        validationService.validateRequired,
                        validationService.validatePhone,
                      ]),
                    },
                    {
                      name: "Email",
                      validator: validationService.composeValidator([
                        validationService.validateRequired,
                        validationService.validateEmail,
                      ]),
                    },

                    {
                      name: "Password",
                      validator: validationService.validatePasswordCreation,
                    },
                  ],
                  values
                );
              }}
              onSubmit={async (values, { setErrors, setSubmitting }) => {
                setSubmitting(true);
                loading.begin();

                const formattedValues = Object.assign({}, values, {
                  Phone: values.Phone
                    ? `${values.Phone}`.replace(/\D/g, "")
                    : "",
                });
                formattedValues["ClientId"] = clientId;

                const response = await authService.registerUser(
                  formattedValues
                );

                setSubmitting(false);
                loading.end();

                if (response.status >= 200 && response.status < 300) {
                  analyticsService.fireEvent("event-form-submit", {
                    formName: "Register Account",
                  });
                  history.push(`registration-email-sent?npn=${values.NPN}`);
                } else {
                  const errorsArr = await response.json();
                  const errMsg =
                    errorsArr[0]?.Value ||
                    errorsArr[0]?.FirstName[0]?.FirstName[0] ||
                    errorsArr[0]?.LastName[0]?.LastName[0] ||
                    errorsArr[0]?.NPN[1]?.NPN[1] ||
                    null;
                  if (errMsg) {
                    addToast({
                      message: errMsg,
                      type: "error",
                    });
                  }

                  analyticsService.fireEvent("event-form-submit-invalid", {
                    formName: "Register Account",
                  });
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
                <form
                  action=""
                  className="form form-width"
                  onSubmit={handleSubmit}
                >
                  <fieldset className="form__fields">
                    <Textfield
                      id="register-npn"
                      className="mb-4"
                      label="National Producer Number"
                      placeholder="Enter your NPN"
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
                      auxLink={
                        <div
                          className={Styles.forgot}
                          data-gtm="login-forgot-npn"
                        >
                          <a
                            href="https://nipr.com/help/look-up-your-npn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm link text-bold"
                          >
                            Forgot NPN?
                          </a>
                        </div>
                      }
                    />
                    <div className="first-last-name">
                      <Textfield
                        id="register-fname"
                        label="First Name"
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
                          (touched.FirstName && errors.FirstName) ||
                          errors.Global
                        }
                      />
                    </div>
                    <div className="first-last-name">
                      <Textfield
                        id="register-lname"
                        className="mb-4"
                        label="Last Name"
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
                        error={
                          (touched.LastName && errors.LastName) || errors.Global
                        }
                      />
                    </div>
                    <Textfield
                      id="register-email"
                      type="email"
                      label="Email Address"
                      placeholder="Enter your email address"
                      name="Email"
                      value={values.Email}
                      readOnly={hasEmail}
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

                    <Textfield
                      id="register-phone"
                      className="mb-4"
                      label="Phone Number"
                      type="tel"
                      placeholder="XXX-XXX-XXXX"
                      name="Phone"
                      value={values.Phone}
                      onChange={handleChange}
                      onBlur={(e) => {
                        analyticsService.fireEvent("leaveField", {
                          field: "phoneNumber",
                          formName: "registration",
                        });
                        return handleBlur(e);
                      }}
                      error={(touched.Phone && errors.Phone) || errors.Global}
                    />

                    <Textfield
                      id="register-password"
                      type="password"
                      label="Create Password"
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
                      error={
                        (touched.Password && errors.Password) || errors.Global
                      }
                      success={
                        touched.Password && !errors.Password && !errors.Global
                      }
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
                      focusBannerVisible={!!errors.Password}
                    />

                    <div className="form__submit centered-flex-col">
                      <button
                        className={`btn-v2 mb-1 login-btn ${analyticsService.clickClass(
                          "registration-submit"
                        )}`}
                        type="submit"
                      >
                        Register
                      </button>
                    </div>
                    <div className={"centered-flex-col"}>
                      <p>Already have an account?</p>
                      {/* TODO: Add login link */}
                      <div
                        onClick={async () => {
                          await login();
                        }}
                        className="text-sm link text-bold"
                      >
                        Login
                      </div>
                    </div>
                  </fieldset>
                </form>
              )}
            </Formik>
          </div>
        </Container>
        <SimpleFooter className="layout-footer" />
      </div>
    </React.Fragment>
  );
};
