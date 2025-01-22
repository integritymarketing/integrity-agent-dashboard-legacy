import useDeviceInfo, { DEVICES } from "hooks/useDeviceInfo";
import useQueryParams from "hooks/useQueryParams";

const IOS_MINIMUM_APP_VERSION = import.meta.env.VITE_IOS_MINIMUM_APP_VERSION;
const ANDROID_MINIMUM_APP_VERSION = import.meta.env.VITE_ANDROID_MINIMUM_APP_VERSION;

// Function to get URL parameters by name
function getURLParameter(name, url) {
    const urlParams = new URLSearchParams(url);
    return urlParams.get(name);
}

function isAppVersionOlderThan(version, targetVersion) {
    // Remove any number between parentheses from the end of version and targetVersion
    version = version.replace(/\(\d+\)$/, "");
    targetVersion = targetVersion.replace(/\(\d+\)$/, "");

    const versionParts = version.split(".").map(Number);
    const targetVersionParts = targetVersion.split(".").map(Number);

    for (let i = 0; i < Math.min(versionParts.length, targetVersionParts.length); i++) {
        if (versionParts[i] < targetVersionParts[i]) {
            return true; // The app version is older
        } else if (versionParts[i] > targetVersionParts[i]) {
            return false; // The app version is newer
        }
    }

    return versionParts.length < targetVersionParts.length;
}

const useMobileVersionCheck = () => {
    const device = useDeviceInfo();
    const params = useQueryParams();
    const url = new URL(params.get("ReturnUrl")).search;
    const versionParam = getURLParameter("Version", url);

    if (versionParam) {
        const minVersion =
            device === DEVICES.IOS || device === DEVICES.IPHONE ? IOS_MINIMUM_APP_VERSION : ANDROID_MINIMUM_APP_VERSION;
        return isAppVersionOlderThan(versionParam, minVersion);
    }

    return true;
};

export default useMobileVersionCheck;
