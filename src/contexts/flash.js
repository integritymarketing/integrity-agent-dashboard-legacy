import React, { createContext, useState } from "react";

const FlashContext = createContext();

export const FlashProvider = (props) => {
  const flashState = useState({
    message: "",
    isVisible: false,
  });

  return <FlashContext.Provider value={flashState} {...props} />;
};

export default FlashContext;
