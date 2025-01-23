import { useCallback, useMemo, useState } from "react";

const defaultFilters = {
    carriers: [],
    states: [],
    years: [],
    products: [],
};

function useFilterData(data) {
    const [filters, setFilters] = useState(defaultFilters);

    const filterCondition = useCallback(
        (row) => {
            const { states, carrier, planYear, planTypes } = row;
            return (
                (!filters.states.length || filters.states.some((item) => states.includes(item))) &&
                (!filters.carriers.length || filters.carriers.includes(carrier)) &&
                (!filters.products.length || filters.products.some((item) => planTypes.includes(item))) &&
                (!filters.years.length || filters.years.includes(planYear))
            );
        },
        [filters]
    );

    const filteredData = useMemo(() => {
        if (
            filters.states.length === 0 &&
            filters.carriers.length === 0 &&
            filters.products.length === 0 &&
            filters.years.length === 0
        ) {
            return data; // Return original data when filters are empty
        } else {
            return data.filter(filterCondition);
        }
    }, [data, filters, filterCondition]);

    return { filters, setFilters, filteredData };
}

export default useFilterData;
