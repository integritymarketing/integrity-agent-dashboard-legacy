import { useEffect, useState } from "react";

export const DEVICES = {
  ANDROID: "ANDROID",
  IOS: "IOS",
  IPHONE: "IPHONE",
  UNKNOWN: "UNKNOWN",
};

const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState("");

  useEffect(() => {
    const getMobileOperatingSystem = () => {
      var userAgent = navigator.userAgent || navigator.vendor || window.opera;

      // Android detection
      if (/android/i.test(userAgent)) {
        return DEVICES.ANDROID;
      }

      // iOS detection
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        // Further check for iPhone
        if (/iPhone/.test(userAgent)) {
          return DEVICES.IPHONE;
        }
        return DEVICES.IOS;
      }

      return DEVICES.UNKNOWN;
    };

    let info = getMobileOperatingSystem();

    setDeviceInfo(info);
  }, []);

  return deviceInfo;
};

export default useDeviceInfo;
