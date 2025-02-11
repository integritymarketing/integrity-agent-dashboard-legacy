import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";

import { Formik } from "formik";

import useClientId from "hooks/auth/useClientId";
import useLoading from "hooks/useLoading";
import useQueryParams from "hooks/useQueryParams";
import useFetch from "hooks/useFetch";

import { ContainerUnAuthenticated } from "components/ContainerUnAuthenticated";
import { FooterUnAuthenticated } from "components/FooterUnAuthenticated";
import { HeaderUnAuthenticated } from "components/HeaderUnAuthenticated";
import Textfield from "components/ui/textfield";

import validationService from "services/validationService";

// NOTE that there are instances of both username + npn in this file (they are the same thing)
// this is to handle compatibility with identity server in the short term
// before we fully transition to 'Username' for everything

const PasswordResetPage = () => {
    const navigate = useNavigate();
    const loading = useLoading();
    const params = useQueryParams();
    const clientId = useClientId();

    const { Post: resetpassword } = useFetch(
        `${import.meta.env.VITE_AUTH_AUTHORITY_URL}/api/v1/account/resetpassword`,
        true
    );

    useEffect(() => {
        // eslint-disable-next-line consistent-return
        const checkIfValidToken = async () => {
            const url = `${import.meta.env.VITE_AUTH_AUTHORITY_URL}/api/v1/account/validateresetpasswordtoken`;

            const body = {
                username: params.get("npn"),
                token: params.get("token"),
                email: params.get("email"),
            };

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                });

                if (response.status === 200) {
                    return true;
                } else {
                    navigate(`/password-link-expired?npn=${params.get("npn")}`);
                    return false;
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };

        checkIfValidToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (values) => {
        loading.begin();
        const response = await resetpassword({
            ...values,
            Username: params.get("npn"),
            Token: params.get("token"),
            Email: params.get("email"),
            ClientId: clientId,
        });

        loading.end();

        if (response.ok) {
            navigate("/password-updated");
        } else {
            const errorsArr = await response.json();
            const errors = validationService.formikErrorsFor(errorsArr);
            throw new Error(errors.Global || "Failed to reset password");
        }
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>Integrity - Reset Password</title>
            </Helmet>
            <div className="content-frame v2">
                <HeaderUnAuthenticated />
                <ContainerUnAuthenticated>
                    <h1 className="hdg hdg--2 mb-3">Set a new password</h1>
                    <Box sx={{ width: 300 }}>
                        <Formik
                            initialValues={{ Password: "", ConfirmPassword: "" }}
                            validate={(values) => {
                                return validationService.validateMultiple(
                                    [
                                        {
                                            name: "Password",
                                            validator: validationService.validatePasswordCreation,
                                        },
                                        {
                                            name: "ConfirmPassword",
                                            validator: validationService.validateFieldMatch(values.Password),
                                        },
                                    ],
                                    values
                                );
                            }}
                            onSubmit={async (values, { setErrors, setSubmitting }) => {
                                setSubmitting(true);
                                try {
                                    await handleSubmit(values);
                                } catch (error) {
                                    setErrors({ Global: error.message });
                                }
                                setSubmitting(false);
                            }}
                        >
                            {({ values, errors, touched, handleSubmit, handleChange, handleBlur }) => (
                                <form action="" className="form" onSubmit={handleSubmit}>
                                    <fieldset className="form__fields">
                                        <Textfield
                                            id="new-password"
                                            type="password"
                                            label="New Password"
                                            placeholder="Enter your new password"
                                            name="Password"
                                            value={values.Password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={errors.Password || errors.Global}
                                            success={touched.Password && !errors.Password && !errors.Global}
                                            focusBanner={
                                                <div className="form-tip">
                                                    <p>Your password must: </p>
                                                    <ul className="list-basic">
                                                        <li>Be at least 8 characters long</li>
                                                        <li>Include at least one uppercase and lowercase letter</li>
                                                        <li>Include at least one number</li>
                                                        <li>Include at least one non-alphanumeric character</li>
                                                    </ul>
                                                </div>
                                            }
                                            focusBannerVisible={Boolean(errors.Password)}
                                        />
                                        <Textfield
                                            id="new-password-repeat"
                                            type="password"
                                            label="Re-enter New Password"
                                            placeholder="Re-enter your new password"
                                            name="ConfirmPassword"
                                            value={values.ConfirmPassword}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={errors.ConfirmPassword || errors.Global || errors.Password}
                                            success={
                                                touched.ConfirmPassword &&
                                                !errors.ConfirmPassword &&
                                                !errors.Global &&
                                                !errors.Password
                                            }
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
                    </Box>
                </ContainerUnAuthenticated>
                <FooterUnAuthenticated />
            </div>
        </React.Fragment>
    );
};

export default PasswordResetPage;
