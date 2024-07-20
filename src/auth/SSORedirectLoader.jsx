import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { useAuth0 } from "@auth0/auth0-react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const SSORedirectLoader = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = searchParams.get("page");

  useEffect(() => {
    (async () => {
      await loginWithRedirect();
      if (isAuthenticated) {
        if (page === "selling-permission") {
          navigate("/selling-permissions");
        }
      }
    })();
  }, [loginWithRedirect, navigate, page, isAuthenticated]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default SSORedirectLoader;
