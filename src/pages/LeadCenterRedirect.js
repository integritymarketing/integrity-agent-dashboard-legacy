import { useEffect } from "react";
import authService from "services/authService";
import RedirectLoadingPage from "pages/RedirectLoading";

export default function LeadCenterRedirect() {

  useEffect(() => {
    authService.handleOpenLeadsCenter();
  }, []);

  return <RedirectLoadingPage />;
}
