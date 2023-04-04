/**
 * A custom hook that prevents mobile users from switching to landscape mode.
 * This hook only applies to non-iPod and non-iPad mobile devices.
 * When the user tries to switch to landscape mode, the screen is locked to portrait mode
 * and a message is displayed on the screen to indicate that landscape mode is not currently supported.
 */
function usePreventLandscapeMode() {
  /**
   * The function that handles orientation changes.
   * If the orientation is landscape, the screen is locked to portrait mode and an overlay element is displayed.
   * If the orientation is a portrait, the overlay element is hidden.
   */
  function handleOrientationChange() {
    // eslint-disable-next-line no-restricted-globals
    const { type } = screen.orientation;

    if (type === "landscape-primary" || type === "landscape-secondary") {
      // eslint-disable-next-line no-restricted-globals
      screen.orientation.lock("portrait").catch(() => {
        console.log("Failed to lock orientation.");
      });

      // Display an overlay element with a message
      const overlay = document.createElement("div");
      overlay.className = "prevent-landscape-mode-overlay";
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "#051D43";
      overlay.style.display = "flex";
      overlay.style.justifyContent = "center";
      overlay.style.alignItems = "center";
      overlay.style.color = "white";
      overlay.style.fontSize = "1.2em";
      overlay.style.textAlign = "center";
      overlay.style.padding = "16px";
      overlay.innerText =
        "Landscape mode is not currently supported for this display size. Please switch to Portrait mode.";
      document.body.appendChild(overlay);
    } else {
      // Hide the overlay element if it exists
      const overlay = document.querySelector(".prevent-landscape-mode-overlay");
      if (overlay) {
        document.body.removeChild(overlay);
      }
    }
  }

  /**
   * Check if the device is a mobile device.
   * This function returns true if the device is a mobile device and false otherwise.
   */
  const isMobile =
    window.matchMedia("(max-width: 767px)").matches &&
    /Android|webOS|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  /**
   * Check if the device is an iPad.
   * This function returns true if the device is an iPad and false otherwise.
   */
  const isIpad = /iPad/.test(navigator.userAgent);

  // If the device is a mobile device and not an iPad, apply the orientation lock and add the event listener.
  if (isMobile && !isIpad && window.screen.orientation) {
    handleOrientationChange();

    // eslint-disable-next-line no-restricted-globals
    screen.orientation.addEventListener("change", handleOrientationChange);

    return () => {
      // eslint-disable-next-line no-restricted-globals
      screen.orientation.removeEventListener("change", handleOrientationChange);
    };
  }
}

export default usePreventLandscapeMode;
