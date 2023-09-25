import { useState, useMemo, useCallback } from "react";

const defaultFilters = {
  carriers: [],
  states: [],
  years: [],
  products: [],
};

function useFilterData(data) {
  const [filters, setFilters] = useState(defaultFilters);

  const filterCondition = useCallback((row) => {
    const { state, carrier, planYear, product } = row;
    return (
      filters.states.includes(state) ||
      filters.carriers.includes(carrier) ||
      filters.products.includes(product) ||
      filters.years.includes(planYear)
    );
  }, [filters]);

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
