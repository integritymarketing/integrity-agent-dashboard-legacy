import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import Textfield from "components/ui/textfield";
import validationService from "services/validationService";
import useLoading from "hooks/useLoading";
import { useHistory } from "react-router-dom";
import useQueryParams from "hooks/useQueryParams";
import analyticsService from "services/analyticsService";
import AuthContext from "contexts/auth";
import Styles from "./AuthPages.module.scss";
import "./mobileStyle.scss";
import Heading2 from "packages/Heading2";
import { HeaderUnAuthenticated } from "components/HeaderUnAuthenticated";
import { FooterUnAuthenticated } from "components/FooterUnAuthenticated";
import { ContainerUnAuthenticated } from "components/ContainerUnAuthenticated";
import { Box } from "@mui/material";
import { Button } from "packages/Button";
import useFetch from "hooks/useFetch";

export default () => {
  const loading = useLoading();
  const history = useHistory();
  const params = useQueryParams();
  const auth = useContext(AuthContext);
  const [mobileAppLogin, setMobileAppLogin] = useState(false);
  const {
    Post: loginUser,
  } = useFetch(`${process.env.REACT_APP_AUTH_AUTHORITY_URL}/login`);
  
  const {
    Post: loginUserWithClinetID,
  } = useFetch(`${process.env.REACT_APP_AUTH_AUTHORITY_URL}/login`);

  useEffect(() => {
    const params1 = new URLSearchParams(
      new URL(params.get("ReturnUrl")).search
    );

    const feature_toggle =
      process.env.REACT_APP_MOBILE_UPDATE === "yes" ? true : false;

    let clientId = params1.get("client_id");
    let version = params1.get("Version");

    if (feature_toggle && !version && clientId === "AgentMobile") {
      history.push("/mobile-app-update");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    async function checkForExtrnalLogin() {
      const params1 = new URLSearchParams(
        new URL(params.get("ReturnUrl")).search
      );

      let clientId = params1.get("client_id");
      if (clientId === "AgentMobile") {
        setMobileAppLogin(true);
      }
      if (
        clientId === "ASBClient" ||
        clientId === "FFLClient" ||
        clientId === "AgentMobileSunfire" ||
        clientId === "ILSClient"
      ) {
        loading.begin();
        let userDetail = {
          Username: params1.get("username"),
          Password: "",
          returnUrl: params.get("ReturnUrl"),
          isExternal: true,
        };
        const response = await loginUserWithClinetID(
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
        <HeaderUnAuthenticated />
        <ContainerUnAuthenticated>
          <Heading2 className={Styles.loginText} text="Login to your account" />
          <Box mt={"1rem"}>
            <Formik
              initialValues={{ Username: "", Password: "" }}
              validate={(values) => {
                return validationService.validateMultiple(
                  [
                    {
                      name: "Username",
                      validator: validationService.composeValidator([
                        validationService.validateRequired,
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
                const response = await loginUser(values);
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
                <form
                  action=""
                  className="form form-width"
                  onSubmit={handleSubmit}
                >
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
                        <div
                          className={Styles.forgot}
                          data-gtm="login-forgot-npn"
                        >
                          <a
                            href="https://nipr.com/help/look-up-your-npn"
                            target="_blank"
                            className="text-sm link text-bold"
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
                        <div
                          className={Styles.forgot}
                          data-gtm="login-forgot-password"
                        >
                          <Link
                            to={`/forgot-password?mobileAppLogin=${mobileAppLogin}`}
                            className="text-sm link text-bold"
                          >
                            Forgot Password?
                          </Link>
                        </div>
                      }
                    />
                    <div className="centered-flex-col">
                      <Button
                        className={`${analyticsService.clickClass(
                          "main-login"
                        )}`}
                        type="submit"
                        size="large"
                      >
                        <Box mx="4rem">Login</Box>
                      </Button>
                    </div>
                    {!mobileAppLogin && (
                      <div className="centered-flex-col">
                        <p className="text-sm ">Don&apos;t have an account?</p>
                        <Link
                          to="/register"
                          className={`link ${analyticsService.clickClass(
                            "setup-newaccount"
                          )}`}
                        >
                          <span className="link text-bold ">Register</span>
                        </Link>
                      </div>
                    )}
                  </fieldset>
                </form>
              )}
            </Formik>
          </Box>
        </ContainerUnAuthenticated>
        <FooterUnAuthenticated mobileAppLogin={mobileAppLogin} />
      </div>
    </React.Fragment>
  );
};
