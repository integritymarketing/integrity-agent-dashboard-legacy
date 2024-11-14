import { useContext } from "react";
import { ProductPreferenceDetailsContext } from "./ProductPreferenceDetailsProvider";

export const useProductPreferenceDetails = () => useContext(ProductPreferenceDetailsContext) ?? {};
