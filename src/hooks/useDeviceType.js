import { useMemo } from 'react';

/**
 * Custom hook to determine the type of device and provide utility flags for device categorization.
 * @returns {Object} An object indicating the device type (desktop, tablet, mobile) and additional utility flags.
 */

const useDeviceType = () => {
  const deviceType = useMemo(() => {
    const userAgent = navigator.userAgent;
    
    const tabletRegex = /iPad|Android.*Tablet|Tablet.*Firefox/;
    const mobileRegex = /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile/;
    const isTablet = tabletRegex.test(userAgent);
    const isMobile = mobileRegex.test(userAgent) && !isTablet;
    const isDesktop = !isTablet && !isMobile;

    const isTabletOrAbove = isTablet || isDesktop;
    const isMobileOrTablet = isMobile || isTablet;
    
    return { isDesktop, isTablet, isMobile, isTabletOrAbove, isMobileOrTablet };
  }, []);

  return deviceType;
};

export default useDeviceType;
