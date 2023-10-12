import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "contexts/auth";

const RedirectToAppropriateRoute = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  
  useEffect(() => {
    if (auth.isAuthenticated()) {
      navigate("dashboard", { replace: true });
    } else {
      navigate("welcome", { replace: true });
    }
  });
  return null;
};

export default RedirectToAppropriateRoute;
