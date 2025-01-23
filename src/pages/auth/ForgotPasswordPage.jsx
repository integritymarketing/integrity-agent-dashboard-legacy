import React, { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

import { Box } from "@mui/material";

import { Formik } from "formik";

import useClientId from "hooks/auth/useClientId";
import useFetch from "hooks/useFetch";
import useLoading from "hooks/useLoading";
import useQueryParams from "hooks/useQueryParams";

import { Button } from "packages/Button";
import Heading2 from "packages/Heading2";
import Paragraph from "packages/Paragraph";

import { ContainerUnAuthenticated } from "components/ContainerUnAuthenticated";
import { FooterUnAuthenticated } from "components/FooterUnAuthenticated";
import { HeaderUnAuthenticated } from "components/HeaderUnAuthenticated";
import { MobileHeaderUnAuthenticated } from "components/MobileHeaderUnAuthenticated";
import Textfield from "components/ui/textfield";

import analyticsService from "services/analyticsService";
import validationService from "services/validationService";

import Styles from "./AuthPages.module.scss";

const ForgotPasswordpage = () => {
    const navigate = useNavigate();
    const loading = useLoading();
    const clientId = useClientId();
    const params = useQueryParams();
    const mobileAppLogin = Boolean(params.get("mobileAppLogin"));
    const { Post: requestPasswordReset } = useFetch(
        `${import.meta.env.VITE_AUTH_AUTHORITY_URL}/api/v1/account/forgotpassword`,
        true
    );

    useEffect(() => {
        analyticsService.fireEvent("event-content-load", {
            pagePath: "/reset-password",
        });
    }, []);

    const appTitle = useMemo(() => {
        switch (clientId) {
            case "AgentMobile":
                return "Agent Mobile - Forgot Password";
            default:
                return "Integrity - Forgot Password";
        }
    }, [clientId]);

    return (
        <React.Fragment>
            <Helmet>
                <title>{appTitle}</title>
            </Helmet>
            <div className="content-frame v2">
                <HeaderUnAuthenticated />
                <MobileHeaderUnAuthenticated />
                <ContainerUnAuthenticated>
                    <Heading2 className={Styles.resetTitle} text="Reset your password" />
                    <Paragraph className={Styles.enterYourNPN} text={"Enter your NPN to reset your password."} />
                    <Formik
                        initialValues={{ Username: "" }}
                        validate={(values) => {
                            return validationService.validateMultiple(
                                [
                                    {
                                        name: "Username",
                                        validator: validationService.composeValidator([
                                            validationService.validateRequired,
                                        ]),
                                    },
                                ],
                                values
                            );
                        }}
                        onSubmit={async (values, { setErrors, setSubmitting }) => {
                            setSubmitting(true);
                            loading.begin();

                            values["ClientId"] = clientId;
                            const response = await requestPasswordReset(values, true);
                            setSubmitting(false);
                            loading.end();
                            if (response.status >= 200 && response.status < 300) {
                                navigate(`/password-reset-sent?npn=${values.Username}`);
                                analyticsService.fireEvent("formSubmit", {
                                    button: "forgotSubmit",
                                    pagePath: window.location.href,
                                });
                                analyticsService.fireEvent("formSubmit", {
                                    button: "forgotSubmit",
                                    pagePath: window.location.href,
                                });
                                analyticsService.fireEvent("event-form-submit", {
                                    formName: "Reset password",
                                });
                            } else {
                                const errorsArr = await response.json();
                                const errors = validationService.formikErrorsFor(errorsArr);

                                if (errors.Global === "account_unconfirmed") {
                                    navigate(`/registration-email-sent?npn=${values.Username}&mode=error`);
                                } else {
                                    analyticsService.fireEvent("event-form-submit-invalid", {
                                        formName: "Reset password",
                                    });
                                    setErrors(errors);
                                    navigate(`/contact-support-invalid-npn/${values.Username}`);
                                }
                            }
                        }}
                    >
                        {({ values, errors, touched, handleSubmit, handleChange, handleBlur }) => (
                            <form action="" className="form form-width" onSubmit={handleSubmit}>
                                <fieldset className="form__fields">
                                    <Textfield
                                        id="forgot-password-username"
                                        label="National Producers Number"
                                        placeholder="Enter your NPN"
                                        name="Username"
                                        value={values.Username}
                                        onChange={handleChange}
                                        onBlur={(e) => {
                                            analyticsService.fireEvent("leaveField", {
                                                field: "username",
                                                formName: "forgot",
                                            });
                                            return handleBlur(e);
                                        }}
                                        error={(touched.Username && errors.Username) || errors.Global}
                                        auxLink={
                                            <div className={Styles.forgot} data-gtm="login-forgot-npn">
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
                                    <div className="centered-flex-col">
                                        <Box mt="3rem">
                                            <Button
                                                className={analyticsService.clickClass("main-login")}
                                                type="submit"
                                                size="large"
                                            >
                                                <Box mx="3rem">Submit</Box>
                                            </Button>
                                        </Box>
                                    </div>
                                </fieldset>
                            </form>
                        )}
                    </Formik>
                </ContainerUnAuthenticated>
                <FooterUnAuthenticated mobileAppLogin={mobileAppLogin} />
            </div>
        </React.Fragment>
    );
};

export default ForgotPasswordpage;
