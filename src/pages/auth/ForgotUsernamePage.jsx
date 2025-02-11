import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";

import { Formik } from "formik";

import useFetch from "hooks/useFetch";
import useLoading from "hooks/useLoading";

import CheckIcon from "components/icons/v2-check";
import Container from "components/ui/container";
import Textfield from "components/ui/textfield";

import SimpleFooter from "partials/simple-footer";
import SimpleHeader from "partials/simple-header";

import analyticsService from "services/analyticsService";
import validationService from "services/validationService";

export default () => {
    const navigate = useNavigate();
    const loading = useLoading();
    const [username, setUsername] = useState();
    const [apiErrors, setApiErrors] = useState([]);
    const { Post: forgotUsername } = useFetch(`${import.meta.env.VITE_AUTH_AUTHORITY_URL}/forgotusername`);

    if (username) {
        return (
            <React.Fragment>
                <Helmet>
                    <title>Integrity - Forgot Username</title>
                </Helmet>
                <div className="content-frame v2">
                    <SimpleHeader />
                    <Container size="small">
                        <CheckIcon className="mb-2" />
                        <div className="text mb-2">{`The email associated with your account is [${username}]`}</div>
                        <div className="text text--secondary">
                            Still need help?{" "}
                            <Link className="link link--force-underline" to="/contact-support">
                                Contact Support
                            </Link>
                        </div>
                    </Container>
                    <SimpleFooter />
                </div>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Integrity - Forgot Username</title>
            </Helmet>
            <div className="content-frame v2">
                <SimpleHeader />
                <Container size="small">
                    <h1 className="hdg hdg--2 mb-1">Recover your email</h1>
                    <p className="text text--secondary mb-4">
                        Enter your name and phone number associated with your account to recover your email address.
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
                            setSubmitting(true);
                            setApiErrors([]);
                            loading.begin();

                            const response = await forgotUsername(values);

                            setSubmitting(false);
                            loading.end();

                            if (response.status >= 200 && response.status < 300) {
                                const email = await response.text();
                                setUsername(email);
                                analyticsService.fireEvent("formSubmit", {
                                    button: "forgotUsernameSubmit",
                                    pagePath: window.location.href,
                                });
                            } else {
                                const errorsArr = await response.json();
                                setApiErrors(errorsArr);
                                const errors = validationService.formikErrorsFor(errorsArr);

                                if (errors.Global === "account_unconfirmed") {
                                    navigate(`registration-email-sent?npn=${values.NPN}&mode=error`);
                                } else {
                                    setErrors(errors);
                                }
                            }
                        }}
                    >
                        {({ values, errors, touched, handleSubmit, handleChange, handleBlur }) => (
                            <form action="" className="form" onSubmit={handleSubmit}>
                                <fieldset className="form__fields">
                                    <Textfield
                                        id="forgotUsername-fname"
                                        label="First Name"
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
                                        error={(touched.FirstName && errors.FirstName) || errors.Global}
                                    />
                                    <Textfield
                                        id="forgotUsername-lname"
                                        label="Last Name"
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
                                        error={(touched.LastName && errors.LastName) || errors.Global}
                                    />

                                    <Textfield
                                        id="forgotUsername-phone"
                                        label="Phone Number"
                                        type="tel"
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
                                        <button className="btn-v2" type="submit">
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
