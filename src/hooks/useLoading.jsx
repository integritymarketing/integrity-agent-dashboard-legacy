import React from "react";
import useFlashMessage from "hooks/useFlashMessage";
import LoadingIcon from "components/icons/loading";

let timeout = null;

const useLoading = () => {
  const { show, dismiss } = useFlashMessage();

  return {
    get isLoading() {
      return timeout !== null;
    },
    begin: ({ delay = 750 } = {}) => {
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

export default useLoading;
