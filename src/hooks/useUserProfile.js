import { useAuth0 } from "@auth0/auth0-react";
import { useMemo } from "react";
import Cookies from 'universal-cookie';

const useUserProfile = () => {
    const auth = useAuth0();

    const userProfile = useMemo(() => {
        if (auth.user) {
            const {
                given_name: firstName,
                family_name: lastName,
                npn,
                email,
                phone,
                agentid: agentId,
                user_roles: roles,
            } = auth.user;

            const fullName = `${firstName} ${lastName}`;
            const cookies = new Cookies();  
            cookies.set('userNPN', npn, { path: '/' }); 
            return {
                fullName,
                firstName,
                lastName,
                npn,
                email,
                phone,
                agentId,
                roles,
            };
        }

        return {
            fullName: "",
            firstName: "",
            lastName: "",
            npn: "",
            email: "",
            phone: "",
            agentId: "",
            roles: [],
        };
    }, [auth.user]);

    return userProfile;
};

export default useUserProfile;
