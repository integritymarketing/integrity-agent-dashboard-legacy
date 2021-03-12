import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Formik } from "formik";
import { useHistory } from "react-router-dom";
import Container from "components/ui/container";
import SimpleHeader from "partials/simple-header";
import SimpleFooter from "partials/simple-footer";
import Textfield from "components/ui/textfield";
import validationService from "services/validationService";
import useLoading from "hooks/useLoading";
import analyticsService from "services/analyticsService";
import authService from "services/authService";
import useQueryParams from "hooks/useQueryParams";

export default () => {
  const history = useHistory();
  const loading = useLoading();
  const params = useQueryParams();
  const [hasNPN] = useState(params.get("npn"));
  const [hasEmail] = useState(params.get("email"));

  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Register Account</title>
      </Helmet>
      <div className="content-frame v2">
        <SimpleHeader />
        <Container size="small">
          <h1 className="text-xl mb-4">Register your account</h1>

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
                      ? validationService.validateNPN
                      : () => null,
                    args: ["NPN Number"],
                  },
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
                Phone: values.Phone ? `${values.Phone}`.replace(/\D/g, "") : "",
              });

              const response = await authService.registerUser(formattedValues);

              setSubmitting(false);
              loading.end();

              if (response.status >= 200 && response.status < 300) {
                history.push(`registration-email-sent?npn=${values.NPN}`);
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
                  {hasNPN && (
                    <Textfield
                      id="register-npn"
                      className="mb-4"
                      label="NPN Number"
                      placeholder="Enter your NPN Number"
                      name="NPN"
                      value={values.NPN}
                      readOnly={hasNPN}
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
                  )}

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
                      (touched.FirstName && errors.FirstName) || errors.Global
                    }
                  />
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
                            Include at least one uppercase and lowercase letter
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

                  <div className="form__submit">
                    <button
                      className={`btn-v2 ${analyticsService.clickClass(
                        "registration-submit"
                      )}`}
                      type="submit"
                    >
                      Register
                    </button>
                  </div>
                </fieldset>
              </form>
            )}
          </Formik>
        </Container>
        <SimpleFooter />
      </div>
    </React.Fragment>
  );
};
