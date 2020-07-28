import { useState, useEffect, useContext } from "react";
import AuthContext from "contexts/auth";

export default () => {
  const auth = useContext(AuthContext);
  const [userProfile, setuserProfile] = useState({
    fullName: "",
    firstName: "",
    lastName: "",
    npn: "",
    email: "",
  });

  useEffect(() => {
    auth.getUser().then((user) => {
      setuserProfile(user.profile);
    });
  }, [auth]);

  return userProfile;
};
