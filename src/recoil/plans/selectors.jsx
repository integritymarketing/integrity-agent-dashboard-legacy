import { selector } from "recoil";
import { filteredPlans, filterList } from "./atoms";

export const filterPlanList = selector({
  key: "filterPlanList",
  get: ({ get }) => {
    const plans = get(filteredPlans);
    const filters = get(filterList);
    return plans.filter((plan) => filters.includes(plan.filters));
  },
});
