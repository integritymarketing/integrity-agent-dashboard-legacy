import React, { useEffect } from "react";
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

export default () => {
  const loading = useLoading();
  const history = useHistory();
  const params = useQueryParams();

  console.log("params 1", params);
  console.log("history", history);
  useEffect(() => {
    async function checkForExtrnalLogin() {
      const params1 = new URLSearchParams(new URL(params.get('ReturnUrl')).search);
      let clientId = params1.get("client_id");
      console.log("clientId", clientId);
      if (clientId === "ASBClient") {
        loading.begin();
        let userDetail = {
          Username: params1.get("username"),
          Password: "",
          returnUrl: params.get("ReturnUrl"),
        };
        // https://ae-api-dev.integritymarketinggroup.com/ae-identity-service/connect/authorize/callback?client_id=AEPortal&redirect_uri=https%3A%2F%2Fae-dev.integritymarketinggroup.com%2Fsignin-oidc&response_type=code&scope=openid%20profile%20email%20IdentityServerApi%20LeadsAPI_Full%20phone%20roles%20QuoteService_Full&state=eee4b1a2d3734a24815a9ee1e803bae1&code_challenge=BaKKPNSfyzClL2rScTF9UPgSufTmAe5sHJ_Tar3Y02U&code_challenge_method=S256&response_mode=query
        const response = await authService.loginUserWithClinetID(userDetail, true);
        console.log('{ response }');
        console.log({ response });
        postLogin(response, {}, userDetail);
      } else {
        analyticsService.fireEvent("event-content-load", {
          pagePath: "/login/",
        });
      }
    }

    checkForExtrnalLogin();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const postLogin = async (response, { setErrors, setSubmitting }, payload) => {
    // a 500 server error occurs when invalid OIDC query string params
    // are present (eg missing ReturnUrl).
    // catch 500 and send to final error page.
    console.log("response", response);
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
        <SimpleHeader />
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
              // a 500 server error occurs when invalid OIDC query string params
              // are present (eg missing ReturnUrl).
              // catch 500 and send to final error page.
              //Need to remove after testing
              // if (response.status >= 500) {
              //   history.push(
              //     `sorry?message=${encodeURIComponent(
              //       "Something went wrong with your login request.  Please try again."
              //     )}`
              //   );
              //   loading.end();
              //   return;
              // }

              // const data = await response.json();
              // setSubmitting(false);
              // loading.end();

              // if (data && data.isOk) {
              //   analyticsService.fireEvent("event-form-submit", {
              //     formName: "Login",
              //   });
              //   window.location = data.redirectUrl;
              // } else {
              //   let errors = validationService.formikErrorsFor(data);

              //   if (errors.Global === "account_unconfirmed") {
              //     analyticsService.fireEvent(
              //       "event-form-submit-account-unconfirmed",
              //       {
              //         formName: "Login",
              //       }
              //     );
              //     history.push(
              //       `registration-email-sent?npn=${values.Username}&mode=error`
              //     );
              //   } else {
              //     analyticsService.fireEvent("event-form-submit-invalid", {
              //       formName: "Login",
              //     });
              //     setErrors(errors);
              //   }
              // }
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
                    label="NPN Number"
                    placeholder="Enter your NPN Number"
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
                          to="https://nipr.com/help/look-up-your-npn"
                          target="_blank"
                          className="text-sm link link--force-underline"
                          href={() => false}
                          rel="noopener noreferrer"
                        >
                          Forgot NPN Number?
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
