import { useContext } from "react";
import { SpendingsContext } from "./SpendingsProvider";

export const useSpendings = () => useContext(SpendingsContext);
