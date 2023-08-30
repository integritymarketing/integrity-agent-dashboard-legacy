import AuthContext from "contexts/auth";
import { useState, useEffect, useContext } from "react";

const useUserProfile = () => {
  const auth = useContext(AuthContext);

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
    if (auth?.userProfile) {
      const { firstName, lastName } = auth?.userProfile;
      const fullName = `${firstName} ${lastName}`;

      setUserProfile({
        ...auth.userProfile,
        fullName: fullName,
        agentId: auth.userProfile?.agentid,
      });
    }
  }, [auth]);

  return userProfile;
};

export default useUserProfile;
