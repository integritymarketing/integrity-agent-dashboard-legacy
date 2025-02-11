import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";

import { Box } from "@mui/material";

import { Formik } from "formik";
import showMobileAppDeepLinking from "utilities/mobileDeepLinking";

import useDeviceInfo, { DEVICES } from "hooks/useDeviceInfo";
import useLoading from "hooks/useLoading";
import useMobileVersionCheck from "hooks/useMobileVersionCheck";
import useQueryParams from "hooks/useQueryParams";
import useFetch from "hooks/useFetch";

import { Button } from "packages/Button";
import Heading2 from "packages/Heading2";

import { ContainerUnAuthenticated } from "components/ContainerUnAuthenticated";
import { FooterUnAuthenticated } from "components/FooterUnAuthenticated";
import { HeaderUnAuthenticated } from "components/HeaderUnAuthenticated";
import { MobileHeaderUnAuthenticated } from "components/MobileHeaderUnAuthenticated";
import Textfield from "components/ui/textfield";

import analyticsService from "services/analyticsService";
import validationService from "services/validationService";
import { getParameterFromUrl } from "./getParameterFromUrl";

import Styles from "./AuthPages.module.scss";
import "./mobileStyle.scss";

const ServerLoginPage = () => {
    const loading = useLoading();
    const navigate = useNavigate();
    const device = useDeviceInfo();
    const isOutdatedVersion = useMobileVersionCheck();
    const [mobileAppLogin, setMobileAppLogin] = useState(false);
    const [appTitle, setAppTitle] = useState("");
    const params = useQueryParams();
    const returnUrl = params.get("ReturnUrl");
    const clientId = getParameterFromUrl(returnUrl, "client_id");
    const isMobileSSO = getParameterFromUrl(returnUrl, "isMobileSSO");
    const { Post: loginUser } = useFetch(`${import.meta.env.VITE_AUTH_AUTHORITY_URL}/login`);
    const { Post: loginUserWithClinetID } = useFetch(`${import.meta.env.VITE_AUTH_AUTHORITY_URL}/login`);

    useEffect(() => {
        if (clientId === "AEPortal" && device === DEVICES.IPHONE) {
            showMobileAppDeepLinking();
        }

        if (isOutdatedVersion && clientId === "AgentMobile") {
            navigate("/mobile-app-update");
        }
    }, [device, params]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        async function checkForExtrnalLogin() {
            const params1 = new URLSearchParams(new URL(params.get("ReturnUrl")).search);

            if (clientId === "AgentMobile") {
                setMobileAppLogin(true);
                setAppTitle("Agent Mobile - Login");
            } else {
                setAppTitle("Integrity - Login");
            }
            if (
                clientId === "ASBClient" ||
                clientId === "FFLClient" ||
                clientId === "AgentMobileSunfire" ||
                isMobileSSO
            ) {
                loading.begin();
                const url = new URL(returnUrl);
                const searchParams = new URLSearchParams(url.search);
                searchParams.append("client_id", clientId);
                const appendedReturnUrl = `${url.origin}${url.pathname}?${searchParams.toString()}`;
                const userDetail = {
                    Username: params1.get("username"),
                    Password: "",
                    returnUrl: appendedReturnUrl,
                };
                const response = await loginUserWithClinetID(userDetail, true);
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
        if (response && response.status >= 500) {
            navigate(
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
            const redirectUrl = new URL(data.redirectUrl);
            redirectUrl.searchParams.append("clientId", clientId);
            window.location = redirectUrl.toString();
        } else {
            const errors = validationService.formikErrorsFor(data);

            if (errors.Global === "account_unconfirmed") {
                analyticsService.fireEvent("event-form-submit-account-unconfirmed", {
                    formName: "Login",
                });
                navigate(`/registration-email-sent?npn=${payload.Username}&mode=error`);
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
                <title>{appTitle}</title>
            </Helmet>
            <div className="content-frame v2">
                <HeaderUnAuthenticated />
                <MobileHeaderUnAuthenticated />
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
                            {({ values, errors, touched, handleSubmit, handleChange, handleBlur }) => (
                                <form action="" className="form form-width" onSubmit={handleSubmit}>
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
                                                <div className={Styles.forgot} data-gtm="login-forgot-npn">
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
                                            autocomplete="username"
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
                                            error={(touched.Password && errors.Password) || errors.Global}
                                            auxLink={
                                                <div className={Styles.forgot} data-gtm="login-forgot-password">
                                                    <Link
                                                        to={`/forgot-password?mobileAppLogin=${mobileAppLogin}`}
                                                        className="text-sm link text-bold"
                                                    >
                                                        Forgot Password?
                                                    </Link>
                                                </div>
                                            }
                                            autocomplete="current-password"
                                        />
                                        <div className="centered-flex-col">
                                            <Button
                                                className={`${analyticsService.clickClass("main-login")}`}
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

export default ServerLoginPage;
