import React, { createContext, useState } from "react";
import clientsService from "services/clientsService";
import { STATES } from "utils/address";

const CountyContext = createContext();

export const CountyProvider = (props) => {
  const [allCounties, setAllCounties] = useState([]);
  const [allStates, setAllStates] = useState([]);

  const doFetch = async (zipcode) => {
    if (zipcode.length === 5) {
      const counties = (await clientsService.getCounties(zipcode)) || [];
      const all_Counties = counties?.map((county) => ({
        value: county.countyName,
        label: county.countyName,
        key: county.countyFIPS,
      }));
      let uniqueStates = [...new Set(counties.map((a) => a.state))];
      const all_States = uniqueStates?.map((state) => {
        let stateName = STATES.filter((a) => a.value === state);
        return {
          label: stateName[0]?.label,
          value: state,
        };
      });

      setAllCounties([...all_Counties]);
      setAllStates([...all_States]);
    } else {
      setAllCounties([]);
      setAllStates([]);
    }
  };

  return (
    <CountyContext.Provider
      value={{
        allCounties: allCounties,
        allStates: allStates,
        doFetch: (zip) => doFetch(zip),
      }}
      {...props}
    />
  );
};

export default CountyContext;
