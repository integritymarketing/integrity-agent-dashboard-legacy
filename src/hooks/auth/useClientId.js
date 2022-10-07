import Cookies from "universal-cookie";

export default () => {
  const cookies = new Cookies();
  return (
    // client_id or AEPortal as last resort fallback if cookie is not present in auth app
    cookies.get("client_id") || "AgentMobileSunfire"
  );
};
