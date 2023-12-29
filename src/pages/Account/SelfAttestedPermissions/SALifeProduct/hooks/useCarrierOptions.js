import { useCallback, useEffect, useState } from "react";

import useFetch from "hooks/useFetch";

const AGENTS_API_VERSION = "v1.0";

function useCarrierOptions() {
    const [error, setError] = useState(null);
    const [originals, setOriginals] = useState(null);
    const [options, setOptions] = useState(null);

    const URL = `${process.env.REACT_APP_QUOTE_URL}/api/${AGENTS_API_VERSION}/FinalExpenses/selfattest/carriers`;

    const { Get: getCarries } = useFetch(URL);

    const fetchCarriesData = useCallback(async () => {
        const res = await getCarries(null, true);
        if (res.ok) {
            const data = await res.json();
            const formattedOptions = data.map((record) => ({
                label: record.carrierName,
                value: record.carrierId,
            }));
            setOriginals(data);
            setOptions(formattedOptions);
        } else {
            setError(true);
        }
    }, [getCarries, setError]);

    useEffect(() => {
        if (!options) {
            fetchCarriesData();
        }
    }, [fetchCarriesData, options]);

    return { options, error, originals };
}

export default useCarrierOptions;
