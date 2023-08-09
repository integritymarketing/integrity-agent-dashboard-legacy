import { useEffect, useState } from "react";

export const DEVICES = {
  ANDROID: "ANDROID",
  IOS: "IOS",
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
        return DEVICES.IOS;
      }

      return "unknown";
    };

    let info = getMobileOperatingSystem();

    setDeviceInfo(info);
  }, []);

  return deviceInfo;
};

export default useDeviceInfo;
