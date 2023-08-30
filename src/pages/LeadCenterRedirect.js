import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import authService from "services/authService";
import RedirectLoadingPage from "pages/RedirectLoading";

export default function LeadCenterRedirect() {
  const { npn } = useParams();

  useEffect(() => {
    authService.handleOpenLeadsCenter(npn);
  }, [npn]);

  return <RedirectLoadingPage />;
}
