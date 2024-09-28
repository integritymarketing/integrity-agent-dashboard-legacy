import { createContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useHealth } from "providers/ContactDetails/ContactDetailsContext";
import { useRecoilState } from "recoil";

import { selectedPharmacyIdAtom } from "recoil/plans/atoms";

export const PharmacyContext = createContext();

export const PharmacyProvider = ({ children }) => {
    const [selectedPharmacy, setSelectedPharmacy] = useState({});
    const { pharmacies, pharmacyLoading } = useHealth();

    const [selectedPharmacyId, setSelectedPharmacyId] = useRecoilState(selectedPharmacyIdAtom);

    useEffect(() => {
        if (selectedPharmacyId) {
            const selectedPharmacyInPharmacies = pharmacies.find((pharmacy) => pharmacy.pharmacyId === selectedPharmacyId);
            if (selectedPharmacyInPharmacies) {
                return setSelectedPharmacy(selectedPharmacyInPharmacies);
            }
        }
        const primaryPharmacy = pharmacies.find((pharmacy) => pharmacy.isPrimary);
        if (primaryPharmacy && pharmacies.length) {
            setSelectedPharmacy(primaryPharmacy);
        } else if (!pharmacies.length) {
            setSelectedPharmacy({});
        }
    }, [pharmacies, setSelectedPharmacy]);

    useEffect(() => {
        setSelectedPharmacyId(selectedPharmacy.pharmacyId);
    }, [selectedPharmacy?.pharmacyId, setSelectedPharmacyId]);

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
