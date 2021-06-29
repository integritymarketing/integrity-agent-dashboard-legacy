import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import useQueryParams from "hooks/useQueryParams";
import authService from "services/authService";
import validationService from "services/validationService";

export default () => {
  const history = useHistory();
  const params = useQueryParams();

  // TODO v2: Does this need to change from npn to email?

  useEffect(() => {
    const handleComfirmEmail = async () => {
      return authService.confirmEmail({
        npn: params.get("npn"),
        token: params.get("token"),
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
