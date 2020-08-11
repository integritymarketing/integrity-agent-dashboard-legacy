import React from "react";
import useFlashMessage from "hooks/useFlashMessage";
import LoadingIcon from "components/icons/loading";

export default () => {
  const { show, dismiss } = useFlashMessage();

  return {
    begin: () => {
      show(
        <div className="toolbar">
          <LoadingIcon /> Loading...
        </div>,
        {
          dismissable: false,
        }
      );
      console.log("begin loading");
    },
    end: () => {
      // dismiss();
      console.log("end loading");
    },
  };
};
