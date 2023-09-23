import { useState, useMemo } from "react";

const defaultFilters = {
  carriers: [],
  states: [],
  years: [],
  products: [],
};

function useFilterData(data) {
  const [filters, setFilters] = useState(defaultFilters);

  const filterCondition = (row) => {
    const { state, carrier, planYear, planType } = row;
    return (
      filters.states.includes(state) ||
      filters.carriers.includes(carrier) ||
      filters.products.includes(planType) ||
      filters.years.includes(planYear)
    );
  };

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
  }, [data, filters]);

  return { filters, setFilters, filteredData };
}

export default useFilterData;
