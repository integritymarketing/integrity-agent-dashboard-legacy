import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const RedirectToAppropriateRoute = () => {
  const history = useHistory();
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      history.replace("/dashboard");
    } else {
      history.replace("/welcome");
    }
  }, [isAuthenticated, history]);

  return null;
};

export default RedirectToAppropriateRoute;
