import { useEffect } from "react";
import RedirectLoadingPage from "pages/RedirectLoading";

export default function LeadCenterRedirect() {
    useEffect(() => {
        window.location.href = `${process.env.REACT_APP_AUTH0_DOMAIN}/authorize?response_type=code&client_id=${process.env.REACT_APP_AUTH0_LEADS_CLIENTS_ID}&redirect_uri=${process.env.REACT_APP_AUTH0_LEADS_REDIRECT_URI}/marketplace&scope=openid%20profile&state=bjBXUDZ5UDlSTlVGcFp5VmRXa1N2SEVnYTVkMEw1UWs4Sjc4SnBPaHdfbw==`;
    }, []);

    return <RedirectLoadingPage />;
}
