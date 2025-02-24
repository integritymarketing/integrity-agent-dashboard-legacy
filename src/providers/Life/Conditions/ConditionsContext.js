import { useContext } from "react";
import { ConditionsContext } from "./ConditionsProvider";

export const useConditions = () => useContext(ConditionsContext) ?? {};
