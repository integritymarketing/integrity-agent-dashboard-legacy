import React, { createContext, useContext, useState, useMemo } from "react";

// Create a context for SAPModalProvider
const SAPModalsContext = createContext(null);

export const SAPModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpriedModalOpen, setIsExpriedModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  // Memoize the context value using useMemo
  const contextValue = useMemo(
    () => ({
      isModalOpen,
      isExpriedModalOpen,
      isErrorModalOpen,
      setIsModalOpen,
      setIsExpriedModalOpen,
      setIsErrorModalOpen,
    }),
    [
      isModalOpen,
      isExpriedModalOpen,
      isErrorModalOpen,
      setIsErrorModalOpen,
      setIsModalOpen,
      setIsExpriedModalOpen,
    ]
  );

  return (
    <SAPModalsContext.Provider value={contextValue}>
      {children}
    </SAPModalsContext.Provider>
  );
};

// Custom hook to access SAPModalsContext
export const useSAPModalsContext = () => {
  const context = useContext(SAPModalsContext);

  if (context === undefined) {
    throw new Error("useSAPModalsContext must be used within SAPModalProvider");
  }

  return context;
};
