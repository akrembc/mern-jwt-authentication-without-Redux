import React, { useState, useContext, useEffect } from "react";

export const LoginErrorContext = React.createContext();
const UpdateLoginErrorContext = React.createContext();

export function useLoginError() {
  return useContext(LoginErrorContext);
}

export function useLoginErrorUpdate() {
  return useContext(UpdateLoginErrorContext);
}

const LoginErrorProvider = ({ children }) => {
  const [loginError, setLoginError] = useState(() => "");

  useEffect(() => {
    console.log("reload login error");
  });

  return (
    <LoginErrorContext.Provider value={loginError}>
      <UpdateLoginErrorContext.Provider value={setLoginError}>
        {children}
      </UpdateLoginErrorContext.Provider>
    </LoginErrorContext.Provider>
  );
};

export default LoginErrorProvider;
