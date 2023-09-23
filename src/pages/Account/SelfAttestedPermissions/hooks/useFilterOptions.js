import { useMemo } from "react";

function useFilterOptions(agents) {
  const uniqValues = (array) => Array.from(new Set(array));

  const filterOptions = useMemo(() => {
    return agents.reduce(
      (acc, { carrier, planType, planYear, state }) => {
        return {
          carriers: uniqValues([...acc.carriers, carrier]),
          states: uniqValues([...acc.states, state]),
          products: uniqValues([...acc.products, planType]),
          planYears: uniqValues([...acc.planYears, planYear]),
        };
      },
      { carriers: [], states: [], products: [], planYears: [] }
    );
  }, [agents]);

  return { filterOptions };
}

export default useFilterOptions;
