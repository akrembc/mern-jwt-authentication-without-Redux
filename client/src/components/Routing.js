import { useRoutes } from "react-router-dom";

import { useRouting } from "../customHooks/useRouting";
import { useAuthenticated } from "../contexts/AuthContext";

export const Routing = () => {
  const authenticated = useAuthenticated();

  return useRoutes(useRouting(authenticated));
};
