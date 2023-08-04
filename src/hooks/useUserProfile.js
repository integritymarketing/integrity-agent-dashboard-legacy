import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";

export default () => {
  const auth = useAuth0();
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    firstName: "",
    lastName: "",
    npn: "",
    email: "",
    phone: "",
    agentid: "",
    roles: [],
  });

  useEffect(() => {
    if (auth.user) {
      const {
        given_name: firstName,
        family_name: lastName,
        npn,
        email,
        phone,
        agentid,
        user_roles: roles,
      } = auth.user;

      const fullName = `${firstName} ${lastName}`;

      setUserProfile({
        fullName,
        firstName,
        lastName,
        npn,
        email,
        phone,
        agentid,
        roles
      });
    }
  }, [auth.user]);

  return userProfile;
};
