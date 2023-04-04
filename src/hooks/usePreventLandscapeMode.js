import { useEffect } from "react";

/**
 * A custom React hook that prevents landscape mode on mobile devices (excluding iPad and iPod).
 * Displays a custom message when landscape mode is not supported for the device's display size.
 */
function usePreventLandscapeMode() {
  useEffect(() => {
    const isMobile =
      /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) && !/iPad|Tablet|iPad Pro/i.test(navigator.userAgent);

    if (isMobile) {
      /**
       * Handler function that checks the device's orientation and prevents landscape mode if necessary.
       * Displays a custom message if the device's display size is not supported in landscape mode.
       */
      const handleOrientationChange = () => {
        const isLandscape = window.innerWidth > window.innerHeight;
        if (isLandscape) {
          document.body.style.overflow = "hidden";
          document.body.style.height = "100%";
          document.body.style.width = "100%";
          document.body.style.position = "fixed";
          const message = document.createElement("div");
          message.innerHTML =
            "Landscape mode is not currently supported for this display size. Please switch to Portrait mode.";
          message.style.background = "rgba(0,0,0,0.7)";
          message.style.color = "#fff";
          message.style.fontSize = "18px";
          message.style.padding = "10px";
          message.style.position = "fixed";
          message.style.top = "50%";
          message.style.left = "50%";
          message.style.transform = "translate(-50%, -50%)";
          message.style.zIndex = "999999";
          message.classList.add("prevent-landscape-message");
          document.body.appendChild(message);
        } else {
          document.body.style.overflow = "";
          document.body.style.height = "";
          document.body.style.width = "";
          document.body.style.position = "";
          const message = document.querySelector(".prevent-landscape-message");
          if (message) {
            message.remove();
          }
        }
      };

      handleOrientationChange();

      window.addEventListener("orientationchange", handleOrientationChange);

      return () => {
        window.removeEventListener(
          "orientationchange",
          handleOrientationChange
        );
      };
    }
  }, []);
}

export default usePreventLandscapeMode;
