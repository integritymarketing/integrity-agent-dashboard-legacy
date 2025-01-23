import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const RedirectToAppropriateRoute = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth0();

    useEffect(() => {
        if (import.meta.env.VITE_BUILD_ENV !== "Production") {
            navigate(isAuthenticated ? "/dashboard" : "/welcome", { replace: true });
        } else {
            if (isAuthenticated) {
                navigate("/dashboard");
            } else {
                window.location.href = "https://integrity.com";
            }
        }
    }, [isAuthenticated, navigate]);

    return null;
};

export default RedirectToAppropriateRoute;
