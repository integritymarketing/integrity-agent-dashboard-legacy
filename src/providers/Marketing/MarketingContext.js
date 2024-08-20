import { useContext } from "react";

import { MarketingContext } from "./MarketingProvider";

export const useMarketing = () => useContext(MarketingContext) ?? {};
