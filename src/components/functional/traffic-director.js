import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const RedirectToAppropriateRoute = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth0();

    useEffect(() => {
        navigate(isAuthenticated ? "dashboard" : "welcome", { replace: true });
    }, [isAuthenticated, navigate]);

    return null;
};

export default RedirectToAppropriateRoute;
