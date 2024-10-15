import { createContext, useState, useCallback, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import useFetch from "hooks/useFetch";
import * as Sentry from "@sentry/react";

export const CountyDataContext = createContext();

/**
 * CountyDataProvider component that provides county data and related functions to its children.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that will consume the context.
 * @returns {JSX.Element} The CountyDataProvider component.
 */

export const CountyDataProvider = ({ children }) => {
    const [countiesData, setCountiesData] = useState([]);
    const [isMultipleCounties, setIsMultipleCounties] = useState(false);
    const [zipCode, setZipCode] = useState(null);

    const URL = `${process.env.REACT_APP_QUOTE_URL}/api/v1.0/Search/GetCounties?zipcode=${zipCode}`;
    const { Get: getCounties, error: errorDetails } = useFetch(URL);

    const fetchCountiesData = useCallback(async () => {
        if (!zipCode) {
            return null;
        }
        try {
            const counties = await getCounties();
            setCountiesData(counties);
            setIsMultipleCounties(counties?.length > 1);
            return counties;
        } catch (error) {
            Sentry.captureException(error);
            return null;
        }
    }, [zipCode, getCounties]);

    const contextValue = useMemo(
        () => ({
            countiesData,
            isMultipleCounties,
            fetchCountiesData,
            errorDetails,
            setZipCode,
            zipCode,
        }),
        [countiesData, isMultipleCounties, fetchCountiesData, errorDetails, zipCode],
    );

    return <CountyDataContext.Provider value={contextValue}>{children}</CountyDataContext.Provider>;
};

CountyDataProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
