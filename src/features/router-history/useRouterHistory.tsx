import { useContext } from "react";
import { RouterHistoryContext } from "./RouterHistoryProvider";

export const useRouterHistory = () => useContext(RouterHistoryContext);
