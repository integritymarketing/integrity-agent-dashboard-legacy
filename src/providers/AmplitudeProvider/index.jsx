import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

const AmplitudeContext = createContext();

export const AmplitudeProvider = ({ children }) => {
    const auth = useAuth0();
    const [isAmplitudeInitialized, setIsAmplitudeInitialized] = useState(false);

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

    return (
        <AmplitudeContext.Provider value={{ isAmplitudeInitialized }}>
            {children}
        </AmplitudeContext.Provider>
    );
};

export const useAmplitude = () => {
    const context = useContext(AmplitudeContext);
    if (context === undefined) {
        throw new Error('useAmplitude must be used within an AmplitudeProvider');
    }
    return context;
};
