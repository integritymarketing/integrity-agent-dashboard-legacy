import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useClientId from "hooks/auth/useClientId";
import useQueryParams from "hooks/useQueryParams";
import validationService from "services/validationService";

const confirmEmailAPI = async (values) => {
    const response = await fetch(`${import.meta.env.VITE_AUTH_AUTHORITY_URL}/confirmemail`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            npn: values.npn,
            token: values.token,
            ClientId: values.ClientId,
        }),
    });
    return response;
};

const RegistrationConfirmEmailPage = () => {
    const navigate = useNavigate();
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
            const response = await handleComfirmEmail();

            if (response.status >= 200 && response.status < 300) {
                navigate("/registration-complete");
            } else {
                const errorsArr = await response.json();
                const errors = validationService.formikErrorsFor(errorsArr);
                if (errors && errors.hasOwnProperty("NPN") && errors.NPN === "account_already_confirmed") {
                    navigate("/registration-complete");
                } else {
                    navigate(`/confirm-link-expired?npn=${params.get("npn")}`);
                }
            }
        };

        confirmEmail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return "";
};

export default RegistrationConfirmEmailPage;
