import Cookies from "universal-cookie";

const useClientId = () => {
  const cookies = new Cookies();
  return (
    // client_id or AEPortal as last resort fallback if cookie is not present in auth app
    cookies.get("client_id") || "AEPortal"
  );
};

export default useClientId;
