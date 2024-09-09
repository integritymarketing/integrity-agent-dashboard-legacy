import { useContext } from "react";
import { CountyDataContext } from "./CountyDataProvider";

/**
 * Custom hook to use the CountyContext.
 *
 * @returns {Object} The context value containing countiesData, isMultipleCounties, and fetchCountiesData.
 */

export const useCountyDataContext = () => {
    const context = useContext(CountyDataContext);
    if (!context) {
        throw new Error("useCountyContext must be used within a CountyProvider");
    }
    return context;
};
