import React, { useEffect } from "react";
import { Formik } from "formik";
import Container from "components/ui/container";
import PageCard from "components/ui/page-card";
import GlobalNav from "partials/simple-header";
import GlobalFooter from "partials/global-footer";
import Textfield from "components/ui/textfield";
import validationService from "services/validation";
import { useHistory } from "react-router-dom";
import useLoading from "hooks/useLoading";
import useParams from "hooks/useParams";

export default () => {
  const history = useHistory();
  const loading = useLoading();
  const params = useParams();

  useEffect(() => {
    const checkIfValidToken = async () => {
      const response = await fetch(
        process.env.REACT_APP_AUTH_AUTHORITY_URL +
          "/api/account/validateresetpasswordtoken",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            npn: params.get("npn"),
            token: params.get("token"),
            email: params.get("email"),
          }),
        }
      );

      if (response.status >= 200 && response.status < 300) {
        return true;
      } else {
        return false;
      }
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
    <div className="content-frame bg-admin text-muted">
      <GlobalNav />
      <Container size="small">
        <PageCard>
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

              const response = await fetch(
                process.env.REACT_APP_AUTH_AUTHORITY_URL +
                  "/api/account/resetpassword",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({
                    ...values,
                    NPN: params.get("npn"),
                    Token: params.get("token"),
                    Email: params.get("email"),
                  }),
                }
              );

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
                      (touched.Password && errors.Password) || errors.global
                    }
                    success={
                      touched.Password && !errors.Password && !errors.global
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
                    focusBannerVisible={!!errors.password}
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
                      errors.global
                    }
                    success={
                      touched.ConfirmPassword &&
                      !errors.ConfirmPassword &&
                      !errors.global
                    }
                  />
                  <div className="form__submit">
                    <button className="btn" type="submit">
                      Submit
                    </button>
                  </div>
                </fieldset>
              </form>
            )}
          </Formik>
        </PageCard>
      </Container>
      <GlobalFooter className="global-footer--simple" />
    </div>
  );
};
