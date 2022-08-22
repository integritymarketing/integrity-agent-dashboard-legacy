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
    phone: "",
    agentid
  });

  useEffect(() => {
    setuserProfile(auth.userProfile);
  }, [auth.userProfile]);

  return userProfile;
};
