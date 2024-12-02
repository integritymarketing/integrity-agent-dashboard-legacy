import { useContext } from "react";
import { LifeIulQuoteContext } from "./LifeIulQuoteProvider";

export const useLifeIulQuote = () => useContext(LifeIulQuoteContext) ?? {};
