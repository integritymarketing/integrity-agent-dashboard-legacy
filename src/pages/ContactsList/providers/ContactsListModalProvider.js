import { createContext, useContext, useMemo, useState } from "react";

// Create a context for ContactsListProvider
const ContactsListModalContext = createContext(null);

// eslint-disable-next-line react/prop-types
export const ContactsListModalProvider = ({ children }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    // Memoize the context value using useMemo
    const contextValue = useMemo(
        () => ({
            isDeleteModalOpen,
            setIsDeleteModalOpen,
            isExportModalOpen,
            setIsExportModalOpen,
        }),
        [isDeleteModalOpen, isExportModalOpen]
    );

    return <ContactsListModalContext.Provider value={contextValue}>{children}</ContactsListModalContext.Provider>;
};

// Custom hook to access ContactsListModalContext
export const useContactsListModalContext = () => {
    const context = useContext(ContactsListModalContext);

    if (context === undefined) {
        throw new Error("useContactsListModalContext must be used within ContactsListModalProvider");
    }

    return context;
};
