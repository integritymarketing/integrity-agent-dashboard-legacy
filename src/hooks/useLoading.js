import React from "react";
import useFlashMessage from "hooks/useFlashMessage";
import LoadingIcon from "components/icons/loading";

let timeout = null;

export default () => {
  const { show, dismiss } = useFlashMessage();

  return {
    begin: ({ delay = 1000 } = {}) => {
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
      if (timeout !== null) {
        clearTimeout(timeout);
        timeout = null;
      }
      dismiss();
    },
  };
};
