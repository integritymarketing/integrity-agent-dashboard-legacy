import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import authService from "services/authService";
import WithLoader from "components/ui/WithLoader";

export default function LeadCenterRedirect() {
  const { npn } = useParams();

  useEffect(() => {
    authService.handleOpenLeadsCenter(npn);
  }, [npn]);

  return <WithLoader isLoading={true} />;
}
