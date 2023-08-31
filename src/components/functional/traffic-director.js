import { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "contexts/auth";

const RedirectToAppropriateRoute = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (auth.isAuthenticated()) {
      history.replace("dashboard");
    } else {
      history.replace("welcome");
    }
  });
  return null;
};

export default RedirectToAppropriateRoute;
