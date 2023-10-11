import { DEVICES } from "hooks/useDeviceInfo";

/**
 * Mobile App Deep Linking and Smart App Banner for Safari on iOS devices.
 *
 * @param {Object} appInfo - Information for the app deep linking.
 * @param {string} appInfo.appId - App's ID.
 * @param {string} appInfo.appArgument - App's argument or URL.
 */
const showMobileAppDeepLinking = (device) => {
  const isSafariBrowser = () => {
    const userAgent = navigator.userAgent;
    return /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  };

  if (
    isSafariBrowser() &&
    device === DEVICES.IOS &&
    process.env.REACT_APP_SMART_APP_BANNER_FLAG === "show"
  ) {
    const metaTag = document.createElement("meta");
    metaTag.name = "apple-itunes-app";
    metaTag.content =
      "app-id=1623328763, app-argument=https://apps.apple.com/us/app/medicarecenter";
    document.getElementsByTagName("head")[0].appendChild(metaTag);
  }
};

export default showMobileAppDeepLinking;
