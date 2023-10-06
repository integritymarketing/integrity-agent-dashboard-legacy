import { useEffect } from "react";
import useDeviceInfo, { DEVICES } from "hooks/useDeviceInfo";

const MobileAppBanner = ({ isMobile }) => {
  const device = useDeviceInfo();

  // Define your app ID and app URL
  const APP_ID = "1623328763";
  const APP_URL = "https://apps.apple.com/us/app/medicarecenter";

  // Check if the user agent is Safari
  const isSafari = () => {
    const userAgent = navigator?.userAgent;
    return userAgent
      ? /Safari/.test(userAgent) && !/Chrome/.test(userAgent)
      : false;
  };

  useEffect(() => {
    if (
      isSafari() &&
      isMobile &&
      device === DEVICES.IOS &&
      process.env.REACT_APP_SMART_APP_BANNER_FLAG === "show"
    ) {
      // Use the custom hook only if the browser is Safari and the mobile device is iOS
      const metaTag = document.createElement("meta");
      metaTag.name = "apple-itunes-app";
      metaTag.content = `app-id=${APP_ID}, app-argument=${APP_URL}`;
      document.getElementsByTagName("head")[0].appendChild(metaTag);
    }
  }, [isMobile, device]);

  // You can render any content here if needed, or just return null
  return null;
};

export default MobileAppBanner;
