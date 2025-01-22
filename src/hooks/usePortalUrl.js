import { useMemo } from "react";
import Cookies from "universal-cookie";

const usePortalUrl = () => {
  const cookies = useMemo(() => new Cookies(), []);

  return useMemo(() => (
      import.meta.env.VITE_PORTAL_URL ||
    cookies.get('portal_url') ||
    cookies.get('client_url') ||
    'https://clients.integrity.com' // Fallback URL if no other sources provide the portal URL.
  ), [cookies]);
};

export default usePortalUrl;
