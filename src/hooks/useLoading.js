import React from "react";
import useFlashMessage from "hooks/useFlashMessage";
import LoadingIcon from "components/icons/loading";

let timeout = null;

export default () => {
  const { show, dismiss } = useFlashMessage();

  return {
    begin: (opts = {}) => {
      const { delay = 1000 } = opts;
      console.log("begin loading");
      timeout = setTimeout(() => {
        show(
          <div className="toolbar">
            <LoadingIcon className="mr-1" /> Loading...
          </div>,
          {
            dismissable: false,
          }
        );
      }, delay);
    },
    end: () => {
      dismiss();
      if (timeout !== null) {
        clearTimeout(timeout);
        timeout = null;
      }
      console.log("end loading");
    },
  };
};
