import { useContext } from "react";

import { ProfessionalProfileContext } from "./ProfessionalProfileProvider";

export const useProfessionalProfileContext = () => useContext(ProfessionalProfileContext) ?? {};
