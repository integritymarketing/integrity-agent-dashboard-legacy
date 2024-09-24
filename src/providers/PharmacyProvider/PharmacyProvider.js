import { createContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useHealth } from "providers/ContactDetails/ContactDetailsContext";

export const PharmacyContext = createContext();

export const PharmacyProvider = ({ children }) => {
    const [selectedPharmacy, setSelectedPharmacy] = useState({});
    const { pharmacies, pharmacyLoading } = useHealth();

    useEffect(() => {
        const primaryPharmacy = pharmacies.find((pharmacy) => pharmacy.isPrimary);

        if (primaryPharmacy && Object.keys(selectedPharmacy).length === 0) {
            setSelectedPharmacy(primaryPharmacy);
        }
    }, [pharmacies]);

    const contextValue = useMemo(
        () => ({
            pharmacies,
            pharmacyLoading,
            selectedPharmacy,
            setSelectedPharmacy,
        }),
        [pharmacies, pharmacyLoading, selectedPharmacy, setSelectedPharmacy],
    );

    return <PharmacyContext.Provider value={contextValue}>{children}</PharmacyContext.Provider>;
};

PharmacyProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
