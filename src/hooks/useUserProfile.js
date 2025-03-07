import { useAuth0 } from "@auth0/auth0-react";
import { useMemo, useEffect, useState } from "react";
import Cookies from 'universal-cookie';

const useUserProfile = () => {
    const auth = useAuth0();
    const [isAmplitudeInitialized, setIsAmplitudeInitialized] = useState(false);

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

    useEffect(() => {
        if (auth.user && !isAmplitudeInitialized) {
            const { npn } = auth.user;

            window.amplitude.init('bdb9ff9f9b4050ae0f8a387d65052a72', npn, {
                fetchRemoteConfig: true,
                autocapture: true
            });

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'Amp User ID Ready',
                ampUserId: npn
            });

            setIsAmplitudeInitialized(true);
        }
    }, [auth.user, isAmplitudeInitialized]);

    return userProfile;
};

export default useUserProfile;
