import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import RedirectLoadingPage from "pages/RedirectLoading";
import { useAuth0 } from "@auth0/auth0-react";

const LeadCenterRedirect = () => {
  const { npn } = useParams();
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    const handleOpenLeadsCenter = async () => {
      const auth0Options = {
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope:
          'openid profile email phone roles IdentityServerApi LeadsAPI_Full AgentService_Full QuoteService_Full NotificationService_Full AgentService_Full',
        redirect_uri: process.env.REACT_APP_AUTH_ILC_REDIRECT_URI,
        appState: { username: npn },
      };

      await loginWithRedirect(auth0Options);
    };

    handleOpenLeadsCenter();
  }, [loginWithRedirect, npn]);

  return <RedirectLoadingPage />;
};

export default LeadCenterRedirect;
