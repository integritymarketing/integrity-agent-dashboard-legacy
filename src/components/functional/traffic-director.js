import { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "contexts/auth";

export default () => {
  const history = useHistory();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (auth.isAuthenticated()) {
      history.replace("home");
    } else {
      history.replace("welcome");
    }
  });
  return null;
};
