import { useEffect } from "react";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";
import useQueryParams from "hooks/useQueryParams";
import useFetch from "hooks/useFetch";

const ServerErrorPage = () => {
    const { Put: getServerError, response } = useFetch(`${import.meta.env.VITE_AUTH_AUTHORITY_URL}/error`);
    const params = useQueryParams();

    const fetchError = async () => {
        const errorId = params.get("errorId");
        await getServerError.put(`?errorId=${errorId}`);
        return response.text();
    };

    useEffect(() => {
        fetchError().then((error) => {
            throw new Error(error);
        }, []);
    });

    return (
        <BaseConfirmationPage
            title="We’re sorry"
            body="An internal server error occurred.  We are looking into the problem, please try again later."
            button=""
        />
    );
};

export default ServerErrorPage;
