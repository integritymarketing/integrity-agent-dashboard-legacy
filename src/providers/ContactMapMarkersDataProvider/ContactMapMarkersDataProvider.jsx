import { createContext, useState, useCallback, useMemo, useEffect } from "react";
import PropTypes from "prop-types";

export const ContactMapMakersDataContext = createContext();

/**
 * ContactMapMarkersDataProvider component that provides contact map markers.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that will consume the context.
 * @returns {JSX.Element} The ContactMapMarkersDataProvider component.
 */

export const ContactMapMarkersDataProvider = ({ children }) => {
    const [tableData, setTableData] = useState([]);
    const contactsData = useMemo(() => {
        return (
            tableData
                ?.filter((item) => item.addresses?.[0]?.latitude && item.addresses?.[0]?.longitude)
                .map((item) => ({
                    position: { lat: item.addresses?.[0]?.latitude, lng: item.addresses?.[0]?.longitude },
                    postalCode: item.addresses?.[0]?.postalCode,
                    isCluster: false,
                    ...item,
                })) || []
        );
    }, [tableData]);
    const contextValue = useMemo(
        () => ({
            contactsData,
            setTableData,
        }),
        [setTableData, contactsData]
    );

    return <ContactMapMakersDataContext.Provider value={contextValue}>{children}</ContactMapMakersDataContext.Provider>;
};

ContactMapMarkersDataProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
