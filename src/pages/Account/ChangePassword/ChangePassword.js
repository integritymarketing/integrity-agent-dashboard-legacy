import { Formik } from "formik";

import Box from "@mui/material/Box";

import useFetch from "hooks/useFetch";
import useLoading from "hooks/useLoading";
import useToast from "hooks/useToast";

import SectionContainer from "mobile/Components/SectionContainer";

import Textfield from "components/ui/textfield";
import RoundButton from "components/RoundButton";

import validationService from "services/validationService";

import styles from "./styles.module.scss";

function ChangePassword() {
    const loading = useLoading();
    const showToast = useToast();

    const { Put: updateAccountPassword } = useFetch(
        `${import.meta.env.VITE_AGENTS_URL}/api/v1.0/Account/UpdatePassword`
    );

    return (
        <Box className={`${styles.customBackground} v2`}>
            <SectionContainer title="Change Your Password">
                <Formik
                    initialValues={{
                        newPassword: "",
                        confirmPassword: "",
                    }}
                    validate={(values) => {
                        return validationService.validateMultiple(
                            [
                                {
                                    name: "newPassword",
                                    validator: validationService.validatePasswordCreation,
                                    args: ["New Password"],
                                },
                                {
                                    name: "confirmPassword",
                                    validator: validationService.validateFieldMatch(values.newPassword),
                                },
                            ],
                            values
                        );
                    }}
                    onSubmit={async (values, { setErrors, setSubmitting, resetForm }) => {
                        const initialValues = {
                            newPassword: "",
                            confirmPassword: "",
                        };
                        resetForm({ initialValues });
                        setSubmitting(true);
                        const response = await updateAccountPassword(values, true);
                        if (response.status >= 200 && response.status < 300) {
                            setSubmitting(false);
                            showToast({
                                message: "Your password has been successfully updated.",
                            });
                        } else {
                            loading.end();
                            const errorsArr = await response.json();
                            showToast({
                                message: "Failed to updated password.",
                                type: "error",
                            });
                            setErrors(
                                validationService.formikErrorsFor(
                                    validationService.standardizeValidationKeys(errorsArr)
                                )
                            );
                        }
                    }}
                >
                    {({ values, errors, touched, isValid, dirty, handleSubmit, handleChange, handleBlur }) => (
                        <form action="" className="form mt-3" onSubmit={handleSubmit}>
                            <fieldset className="form__fields form__fields--constrained">
                                <Textfield
                                    id="account-password"
                                    type="password"
                                    label="Create New Password"
                                    name="newPassword"
                                    placeholder="Create a new password"
                                    value={values.newPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.newPassword && errors.newPassword}
                                    success={touched.newPassword && !errors.newPassword}
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
                                    focusBannerVisible={Boolean(errors.newPassword)}
                                />
                                <Textfield
                                    id="account-password-verify"
                                    type="password"
                                    label="Re-enter New Password"
                                    name="confirmPassword"
                                    placeholder="Re-enter your new password"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.confirmPassword && errors.confirmPassword}
                                    success={touched.confirmPassword && !errors.confirmPassword && !errors.newPassword}
                                />

                                <Box display="flex" justifyContent="flex-end" marginTop="20px">
                                    <RoundButton type="submit" label="Save" disabled={!dirty || !isValid} />
                                </Box>
                            </fieldset>
                        </form>
                    )}
                </Formik>
            </SectionContainer>
        </Box>
    );
}

export default ChangePassword;
