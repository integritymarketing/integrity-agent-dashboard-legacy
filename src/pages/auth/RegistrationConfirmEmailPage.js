import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import useClientId from "hooks/auth/useClientId";
import useQueryParams from "hooks/useQueryParams";
import validationService from "services/validationService";

const confirmEmailAPI = async (values) => {
  const response = await fetch(
    `${process.env.REACT_APP_AUTH_AUTHORITY_URL}/api/v2.0/account/confirmemail`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        npn: values.npn,
        token: values.token,
        ClientId: values.ClientId,
      }),
    }
  );
  return response;
};

const RegistrationConfirmEmailPage = () => {
  const history = useHistory();
  const params = useQueryParams();
  const clientId = useClientId();

  useEffect(() => {
    const handleComfirmEmail = async () => {
      return confirmEmailAPI({
        npn: params.get("npn"),
        token: params.get("token"),
        ClientId: clientId,
      });
    };

    const confirmEmail = async () => {
      let response = await handleComfirmEmail();

      if (response.status >= 200 && response.status < 300) {
        history.push("registration-complete");
      } else {
        let errorsArr = await response.json();
        let errors = validationService.formikErrorsFor(errorsArr);
        if (
          errors &&
          errors.hasOwnProperty("NPN") &&
          errors.NPN === "account_already_confirmed"
        ) {
          history.push("registration-complete");
        } else {
          history.push(`confirm-link-expired?npn=${params.get("npn")}`);
        }
      }
    };

    confirmEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return "";
};

export default RegistrationConfirmEmailPage;
