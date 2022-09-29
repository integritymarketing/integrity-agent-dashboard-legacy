import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import Container from "components/ui/container";
import SimpleHeader from "partials/simple-header";
import SimpleFooter from "partials/simple-footer";
// import InfoIcon from "components/icons/info";
import Textfield from "components/ui/textfield";
import validationService from "services/validationService";
import useLoading from "hooks/useLoading";
import { useHistory } from "react-router-dom";
import useQueryParams from "hooks/useQueryParams";
import analyticsService from "services/analyticsService";
import authService from "services/authService";
import AuthContext from "contexts/auth";
export default () => {
  const loading = useLoading();
  const history = useHistory();
  const params = useQueryParams();
  const auth = useContext(AuthContext);
  
  const [mobileAppLogin, setMobileAppLogin] = useState(false);

  useEffect(() => {
    async function checkForExtrnalLogin() {
      const params1 = new URLSearchParams(
        new URL(params.get("ReturnUrl")).search
      );
      let clientId = params1.get("client_id");
      console.log("clientId", clientId)
      if ( clientId === "ASBClient"){
        setMobileAppLogin(true);
      }
      if (
        clientId === "ASBClient" ||
        clientId === "FFLClient" ||
        clientId === "ILSClient"
      ) {
        loading.begin();
        let userDetail = {
          Username: params1.get("username"),
          Password: "",
          returnUrl: params.get("ReturnUrl"),
          isExternal: true,
        };
        const response = await authService.loginUserWithClinetID(
          userDetail,
          true
        );
        postLogin(response, {}, userDetail, auth);
      } else {
        analyticsService.fireEvent("event-content-load", {
          pagePath: "/login/",
        });
      }
    }

    checkForExtrnalLogin();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const postLogin = async (
    response,
    { setErrors, setSubmitting },
    payload,
    auth
  ) => {
    // a 500 server error occurs when invalid OIDC query string params
    // are present (eg missing ReturnUrl).
    // catch 500 and send to final error page.
    if (response && response.status >= 500) {
      history.push(
        `sorry?message=${encodeURIComponent(
          "Something went wrong with your login request.  Please try again."
        )}`
      );
      loading.end();
      return;
    }
    const data = await response.json();
    if (setSubmitting) {
      setSubmitting(false);
    }
    loading.end();
    if (data && data.isOk) {
      analyticsService.fireEvent("event-form-submit", {
        formName: "Login",
      });
      window.location = data.redirectUrl;
    } else {
      let errors = validationService.formikErrorsFor(data);

      if (errors.Global === "account_unconfirmed") {
        analyticsService.fireEvent("event-form-submit-account-unconfirmed", {
          formName: "Login",
        });
        history.push(
          `registration-email-sent?npn=${payload.Username}&mode=error`
        );
      } else {
        analyticsService.fireEvent("event-form-submit-invalid", {
          formName: "Login",
        });
        if (setErrors) {
          setErrors(errors);
        }
      }
    }
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Login</title>
      </Helmet>
      <div className="content-frame v2">
        <SimpleHeader mobileAppLogin={mobileAppLogin} />
        <Container size="small">
          <h1 className="text-xl mb-2">Login to your account</h1>

          {/* <div className="auth-notification">
            <InfoIcon style={{ display: "block" }} />
            <p>
              Please login to your account using your email, not your NPN.{" "}
              <Link to="/forgot-username">Forgot your email?</Link>
            </p>
          </div> */}

          <Formik
            initialValues={{ Username: "", Password: "" }}
            validate={(values) => {
              return validationService.validateMultiple(
                [
                  {
                    name: "Username",
                    validator: validationService.composeValidator([
                      validationService.validateRequired,
                      // validationService.validateEmail,
                    ]),
                  },
                  {
                    name: "Password",
                    validator: validationService.validatePasswordAccess,
                  },
                ],
                values
              );
            }}
            onSubmit={async (values, { setErrors, setSubmitting }) => {
              setSubmitting(true);
              loading.begin();
              values.returnUrl = params.get("ReturnUrl");
              const response = await authService.loginUser(values);
              postLogin(response, { setErrors, setSubmitting }, values);
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
                    id="login-username"
                    className="mb-3"
                    label="National Producer Number (NPN)"
                    placeholder="Enter your NPN"
                    name="Username"
                    value={values.Username}
                    onChange={handleChange}
                    onBlur={(e) => {
                      analyticsService.fireEvent("leaveField", {
                        field: "username",
                        formName: "login",
                      });
                      return handleBlur(e);
                    }}
                    error={touched.Username && errors.Username}
                    auxLink={
                      <div className="mt-2" data-gtm="login-forgot-npn">
                        <a
                          href="https://nipr.com/help/look-up-your-npn"
                          target="_blank"
                          className="text-sm link link--force-underline"
                          rel="noopener noreferrer"
                        >
                          Forgot NPN?
                        </a>
                      </div>
                    }
                  />
                  <Textfield
                    id="login-password"
                    type="password"
                    label="Password"
                    placeholder="Enter your Password"
                    name="Password"
                    value={values.Password}
                    onChange={handleChange}
                    onBlur={(e) => {
                      analyticsService.fireEvent("leaveField", {
                        field: "password",
                        formName: "login",
                      });
                      return handleBlur(e);
                    }}
                    error={
                      (touched.Password && errors.Password) || errors.Global
                    }
                    auxLink={
                      <div className="mt-2" data-gtm="login-forgot-password">
                        <Link
                          to="/forgot-password"
                          className="text-sm link link--force-underline"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                    }
                  />
                  <div className="form__submit">
                    <button
                      className={`btn-v2 mb-4 ${analyticsService.clickClass(
                        "main-login"
                      )}`}
                      type="submit"
                    >
                      Login
                    </button>
                  </div>
                  {!mobileAppLogin && (
                    <p className="text-sm">
                      {`Need to `}
                      <Link
                        to="/register"
                        className={`link link--secondary link--force-underline ${analyticsService.clickClass(
                          "setup-newaccount"
                        )}`}
                      >
                        register for an account?
                      </Link>
                      {/* {` or `}
                    <Link
                      to="/forgot-username"
                      className={`link link--secondary link--force-underline ${analyticsService.clickClass(
                        "forgot-email"
                      )}`}
                    >
                      forgot your email?
                    </Link> */}
                    </p>
                  )}
                </fieldset>
              </form>
            )}
          </Formik>
        </Container>
        <SimpleFooter mobileAppLogin={mobileAppLogin} />
      </div>
    </React.Fragment>
  );
};
