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
            initialValues={{ password: "", confirmPassword: "" }}
            validate={(values) => {
              return validationService.validateMultiple(
                [
                  {
                    name: "password",
                    validator: validationService.validatePasswordCreation,
                  },
                  {
                    name: "confirmPassword",
                    validator: validationService.validateFieldMatch(
                      values.password
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
                    npn: params.get("npn"),
                    token: params.get("token"),
                    email: params.get("email"),
                  }),
                }
              );

              setSubmitting(false);
              loading.end();

              if (response.status >= 200 && response.status < 300) {
                history.push("password-updated");
              } else {
                const data = await response.json();
                setErrors(data);
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
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      (touched.password && errors.password) || errors.global
                    }
                    success={
                      touched.password && !errors.password && !errors.global
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
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      (touched.confirmPassword && errors.confirmPassword) ||
                      errors.global
                    }
                    success={
                      touched.confirmPassword &&
                      !errors.confirmPassword &&
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
