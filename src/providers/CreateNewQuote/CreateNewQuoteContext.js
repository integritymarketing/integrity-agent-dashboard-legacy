import { useContext } from "react";

import { CreateNewQuoteContext } from "./CreateNewQuoteProvider";

export const useCreateNewQuote = () => useContext(CreateNewQuoteContext) ?? {};
