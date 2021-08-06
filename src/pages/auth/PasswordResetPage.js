import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Formik } from "formik";
import Container from "components/ui/container";
import SimpleHeader from "partials/simple-header";
import SimpleFooter from "partials/simple-footer";
import Textfield from "components/ui/textfield";
import validationService from "services/validationService";
import { useHistory } from "react-router-dom";
import useLoading from "hooks/useLoading";
import useClientId from "hooks/useClientId";
import useQueryParams from "hooks/useQueryParams";
import authService from "services/authService";

// NOTE that there are instances of both username + npn in this file (they are the same thing)
// this is to handle compatibility with identity server in the short term
// before we fully transition to 'Username' for everything

export default () => {
  const history = useHistory();
  const loading = useLoading();
  const params = useQueryParams();

  useEffect(() => {
    const checkIfValidToken = async () => {
      const response = await authService.validatePasswordResetToken({
        username: params.get("npn"),
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
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Reset Password</title>
      </Helmet>
      <div className="content-frame v2">
        <SimpleHeader />
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
              const clientId = useClientId();

              const response = await authService.resetPassword({
                ...values,
                Username: params.get("npn"),
                Token: params.get("token"),
                Email: params.get("email"),
                ClientId: clientId,
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
                  <Textfield
                    id="new-password"
                    type="password"
                    label="New Password"
                    placeholder="Enter your new password"
                    name="Password"
                    value={values.Password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      (touched.Password && errors.Password) || errors.Global
                    }
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
                          <li>
                            Include at least one non-alphanumeric character
                          </li>
                        </ul>
                      </div>
                    }
                    focusBannerVisible={!!errors.Password}
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
