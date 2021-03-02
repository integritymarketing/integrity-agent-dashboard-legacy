import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Formik } from "formik";
import Container from "components/ui/container";
import GlobalNav from "partials/simple-header";
import SimpleFooter from "partials/simple-footer";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";
import { InvertedTextfield } from "components/ui/textfield";
import BackLink from "components/ui/back-link";
import validationService from "services/validationService";
import useLoading from "hooks/useLoading";
import ProfileIcon from "components/icons/profile";
import PhoneIcon from "components/icons/phone";
import analyticsService from "services/analyticsService";
import authService from "services/authService";

export default () => {
  const history = useHistory();
  const loading = useLoading();
  const [username, setUsername] = useState();
  const [apiErrors, setApiErrors] = useState([]);

  if (username) {
    return (
      <React.Fragment>
        <Helmet>
          <title>MedicareCENTER - Forgot Username</title>
        </Helmet>
        <BaseConfirmationPage
          // footer={<button>Contact Support</button>}
          // title="Thank you"
          body={`The email associated with your account is [${username}]`}
        />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Forgot Username</title>
      </Helmet>
      <div className="content-frame bg-photo bg-img-fixed text-invert">
        <GlobalNav />
        <Container size="small">
          <BackLink
            component={Link}
            onClick={authService.redirectAndRestartLoginFlow}
            to="/"
          >
            Back to Login
          </BackLink>
          <h1 className="hdg hdg--2 mb-1 mt-3">Recover your email</h1>
          <p className="text-body mb-4">
            Enter your name and phone number to recover your email address.{" "}
          </p>

          {apiErrors.length > 0 && (
            <ul className="auth-error-box">
              {apiErrors.map((apiError) => (
                <li key={`${apiError.Key}--${apiError.Value}`}>
                  <span>&#9888;</span> {apiError.Value}
                </li>
              ))}
            </ul>
          )}

          <Formik
            initialValues={{
              FirstName: "",
              LastName: "",
              Phone: "",
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
                    name: "Phone",
                    validator: validationService.composeValidator([
                      validationService.validateRequired,
                      validationService.validatePhone,
                    ]),
                  },
                ],
                values
              );
            }}
            onSubmit={async (values, { setErrors, setSubmitting }) => {
              console.log("onSubmit!!");
              setSubmitting(true);
              setApiErrors([]);
              loading.begin();

              const response = await authService.forgotUsername(values);

              setSubmitting(false);
              loading.end();

              if (response.status >= 200 && response.status < 300) {
                const email = await response.text();
                console.log("SUCCESS STATUS, NOW WHAT?!", email);
                setUsername(email);
                // history.push(`forgot-username-reveal?email=${data}`);
                // analyticsService.fireEvent("formSubmit", {
                //   button: "forgotUsernameSubmit",
                //   pagePath: window.location.href,
                // });
              } else {
                const errorsArr = await response.json();
                setApiErrors(errorsArr);
                let errors = validationService.formikErrorsFor(errorsArr);

                if (errors.Global === "account_unconfirmed") {
                  history.push(
                    `registration-email-sent?npn=${values.NPN}&mode=error`
                  );
                } else {
                  setErrors(errors);
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
              <form action="" className="form" onSubmit={handleSubmit}>
                <fieldset className="form__fields">
                  <InvertedTextfield
                    id="forgotUsername-fname"
                    label="First Name"
                    icon={<ProfileIcon />}
                    placeholder="Enter your first name"
                    name="FirstName"
                    value={values.FirstName}
                    onChange={handleChange}
                    onBlur={(e) => {
                      analyticsService.fireEvent("leaveField", {
                        field: "firstName",
                        formName: "forgotUsername",
                      });
                      return handleBlur(e);
                    }}
                    error={
                      (touched.FirstName && errors.FirstName) || errors.Global
                    }
                  />
                  <InvertedTextfield
                    id="forgotUsername-lname"
                    label="Last Name"
                    icon={<ProfileIcon />}
                    placeholder="Enter your last name"
                    name="LastName"
                    value={values.LastName}
                    onChange={handleChange}
                    onBlur={(e) => {
                      analyticsService.fireEvent("leaveField", {
                        field: "lastName",
                        formName: "forgotUsername",
                      });
                      return handleBlur(e);
                    }}
                    error={
                      (touched.LastName && errors.LastName) || errors.Global
                    }
                  />

                  <InvertedTextfield
                    id="forgotUsername-phone"
                    label="Phone Number"
                    type="tel"
                    icon={<PhoneIcon />}
                    placeholder="XXX-XXX-XXXX"
                    name="Phone"
                    value={values.Phone}
                    onChange={handleChange}
                    onBlur={(e) => {
                      analyticsService.fireEvent("leaveField", {
                        field: "phoneNumber",
                        formName: "forgotUsername",
                      });
                      return handleBlur(e);
                    }}
                    error={(touched.Phone && errors.Phone) || errors.Global}
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
    </React.Fragment>
  );
};
