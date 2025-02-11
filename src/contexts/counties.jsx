import { createContext, useCallback, useState } from "react";

import PropTypes from "prop-types";

import { STATES } from "utils/address";
import { useClientServiceContext } from "services/clientServiceProvider";

const CountyContext = createContext();

/**
 * CountyProvider is a context provider for counties and states.
 *
 * @param {object} props - The props for the component.
 */

export const CountyProvider = ({ children }) => {
    const [allCounties, setAllCounties] = useState([]);
    const [allStates, setAllStates] = useState([]);
    const [loading, setLoading] = useState(false);
    const { clientsService } = useClientServiceContext();

    const fetchCountyAndState = useCallback(async (zipcode) => {
        if (zipcode.length === 5) {
            setLoading(true);
            try {
                const fetchedCounties = await clientsService.getCounties(zipcode);
                const countyOptions =
                    fetchedCounties?.map((county) => ({
                        value: county.countyName,
                        label: county.countyName,
                        key: county.countyFIPS,
                        state: county.state,
                    })) || [];

                const uniqueStates = [...new Set(fetchedCounties.map((county) => county.state))];
                const stateOptions = uniqueStates?.map((state) => {
                    const stateDetail = STATES.find((stateInfo) => stateInfo.value === state);
                    return {
                        label: stateDetail?.label,
                        value: state,
                    };
                });

                setAllCounties(countyOptions);
                setAllStates(stateOptions);
            } finally {
                setLoading(false);
            }
        } else {
            setAllCounties([]);
            setAllStates([]);
        }
    }, []);

    return (
        <CountyContext.Provider
            value={{
                loading,
                allCounties,
                allStates,
                fetchCountyAndState,
            }}
        >
            {children}
        </CountyContext.Provider>
    );
};

CountyProvider.propTypes = {
    children: PropTypes.node.isRequired, // Children are expected to be passed to the Provider
};

export default CountyContext;
