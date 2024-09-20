import { useContext } from "react";

import { PharmacyContext } from "./PharmacyProvider";

export const usePharmacyContext = () => {
    const context = useContext(PharmacyContext);

    if (context === undefined) {
        throw new Error("usePharmacyContext must be used within PharmacyProvider");
    }

    return context;
};
