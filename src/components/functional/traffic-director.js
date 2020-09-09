import { useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "contexts/auth";

export default () => {
  const history = useHistory();
  const auth = useContext(AuthContext);

  if (auth.isAuthenticated()) {
    history.push("dashboard");
  } else {
    history.push("welcome");
  }
  return "";
};
