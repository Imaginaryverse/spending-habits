import { useContext } from "react";
import { SpendingEditorContext } from "./SpendingEditorProvider";

export const useSpendingEditor = () => useContext(SpendingEditorContext);
