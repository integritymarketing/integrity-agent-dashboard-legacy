import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";

const useUserProfile = () => {
  const { user } = useAuth0();
  
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    firstName: "",
    lastName: "",
    npn: "",
    email: "",
    phone: "",
    agentId: "",
    roles: [],
  });

  useEffect(() => {
    if (user) {
      const {
        given_name: firstName,
        family_name: lastName,
        npn,
        email,
        phone,
        agentid: agentId,
        user_roles: roles,
      } = user;

      const fullName = `${firstName} ${lastName}`;

      setUserProfile({
        fullName,
        firstName,
        lastName,
        npn,
        email,
        phone,
        agentId,
        roles
      });
    }
  }, [user]);

  return userProfile;
};

export default useUserProfile;
