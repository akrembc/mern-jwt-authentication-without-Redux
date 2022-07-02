import React from "react";

import ModalProvider, { ShowModalContext } from "../contexts/ModalContext";
import AuthenticationProvider from "../contexts/AuthContext";
import LoginErrorProvider from "../contexts/LoginErrorContext";
import ContextCombiner from "./ContextCombiner";

export const AppContextProvider = ({ children }) => {
  const modal = {
    Provider: ModalProvider,
    StateContext: ShowModalContext,
  };

  const authenticated = {
    Provider: AuthenticationProvider,
  };

  const loginError = {
    Provider: LoginErrorProvider,
  };

  const contexts = [modal, authenticated, loginError];

  return <ContextCombiner contexts={contexts}>{children}</ContextCombiner>;
};
