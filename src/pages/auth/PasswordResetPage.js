import React, { useEffect } from "react";
import { Formik } from "formik";
import Container from "components/ui/container";
import GlobalNav from "partials/simple-header";
import SimpleFooter from "partials/simple-footer";
import { InvertedTextfield } from "components/ui/textfield";
import validationService from "services/validation";
import { useHistory } from "react-router-dom";
import useLoading from "hooks/useLoading";
import useParams from "hooks/useParams";
import LockIcon from "components/icons/lock";
import authService from "services/authService";

export default () => {
  const history = useHistory();
  const loading = useLoading();
  const params = useParams();

  useEffect(() => {
    const checkIfValidToken = async () => {
      const response = await authService.validatePasswordResetToken({
        npn: params.get("npn"),
        token: params.get("token"),
        email: params.get("email"),
      });

      return response.status >= 200 && response.status < 300;
    };
    const validateTokenOrRedirect = async () => {
      let isValidToken = await checkIfValidToken();
      if (!isValidToken) {
        history.push(`password-link-expired?npn=${params.get("npn")}`);
      }
    };

    validateTokenOrRedirect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="content-frame bg-photo bg-img-fixed text-invert">
      <GlobalNav />
      <Container size="small">
        <h1 className="hdg hdg--2 mb-3">Set a new password</h1>

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
                  validator: validationService.validateFieldMatch(
                    values.Password
                  ),
                },
              ],
              values
            );
          }}
          onSubmit={async (values, { setErrors, setSubmitting }) => {
            setSubmitting(true);
            loading.begin();

            const response = await authService.resetPassword({
              ...values,
              NPN: params.get("npn"),
              Token: params.get("token"),
              Email: params.get("email"),
            });

            setSubmitting(false);
            loading.end();

            if (response.status >= 200 && response.status < 300) {
              history.push("password-updated");
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
                <InvertedTextfield
                  id="new-password"
                  type="password"
                  label="New Password"
                  icon={<LockIcon />}
                  placeholder="Enter your new password"
                  name="Password"
                  value={values.Password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={(touched.Password && errors.Password) || errors.Global}
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
                        <li>Include at least one non-alphanumeric character</li>
                      </ul>
                    </div>
                  }
                  focusBannerVisible={!!errors.Password}
                />
                <InvertedTextfield
                  id="new-password-repeat"
                  type="password"
                  label="Re-enter New Password"
                  icon={<LockIcon />}
                  placeholder="Re-enter your new password"
                  name="ConfirmPassword"
                  value={values.ConfirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    (touched.ConfirmPassword && errors.ConfirmPassword) ||
                    errors.Global
                  }
                  success={
                    touched.ConfirmPassword &&
                    !errors.ConfirmPassword &&
                    !errors.Global &&
                    !errors.Password
                  }
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
  );
};
