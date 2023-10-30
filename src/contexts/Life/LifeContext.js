import { useContext } from "react";

import { LifeContext } from "./LifeProvider";

export const useLife = () => useContext(LifeContext) ?? {};
