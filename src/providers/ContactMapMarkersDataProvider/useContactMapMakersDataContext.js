import { useContext } from "react";
import { ContactMapMakersDataContext } from "./ContactMapMarkersDataProvider";

/**
 * Custom hook to use the ContactMapMakersDataContext.
 *
 * @returns {Object} The context value containing isLoading, .
 */

export const useContactMapMakersDataContext = () => {
    const context = useContext(ContactMapMakersDataContext);
    if (!context) {
        throw new Error("useContactMapMakersDataContext must be used within a ContactMapMarkersDataProvider");
    }
    return context;
};
