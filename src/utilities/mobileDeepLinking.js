/**
 * Check if the current browser is Safari
 * @returns {boolean} - True if the browser is Safari, otherwise false.
 */
const isSafariBrowser = () => {
    const { userAgent } = navigator;
    return /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
};

/**
 * Create or replace the meta tag for apple-itunes-app in the document head.
 */
const createOrReplaceMetaTag = () => {
    const existingMetaTag = document.querySelector('meta[name="apple-itunes-app"]');

    if (existingMetaTag) {
        console.log("Meta tag already exists. Replacing it.");
        existingMetaTag.remove();
    }

    const metaTag = document.createElement("meta");
    metaTag.name = "apple-itunes-app";
    metaTag.content = "app-id=1623328763, app-argument=https://apps.apple.com/us/app/medicarecenter";
    document.getElementsByTagName("head")[0].appendChild(metaTag);
};

/**
 * Mobile App Deep Linking and Smart App Banner for Safari on iOS devices.
 *
 */
const showMobileAppDeepLinking = () => {
    if (isSafariBrowser()) {
        createOrReplaceMetaTag();
    }
};

export default showMobileAppDeepLinking;
