import { useContext } from "react";
import { DemoContext } from "./DemoProvider";

export const useDemo = () => useContext(DemoContext);
