import * as Sentry from "@sentry/react";

export const handleCSGSSO = async (navigate, token, npn, email) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_AUTH_AUTHORITY_URL}/external/csglogin/${npn}/${email}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (response.status >= 200 && response.status < 300) {
            const result = await response.json();
            const formattedRes = result.reduce((acc, { Key, Value }) => ({ ...acc, [Key]: Value }), {});
            window.open(formattedRes.redirect_url, "_blank");
        } else {
            navigate("/error");
        }
    } catch (error) {
        Sentry.captureException(error);
        navigate("/error");
    }
};
