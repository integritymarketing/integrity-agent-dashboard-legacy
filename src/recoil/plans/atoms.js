import { atom } from "recoil";

export const filteredPlans = atom({
  key: "filteredPlans",
  default: [],
});

export const filterList = atom({
  key: "filterList",
  default: [],
});
