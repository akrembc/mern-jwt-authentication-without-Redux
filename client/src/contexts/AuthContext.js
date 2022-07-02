import React, { useState, useEffect, useContext } from "react";

import useCookie from "../customHooks/useCookie";
// import jwtDecode from "jwt-decode";

export const AuthenticationContext = React.createContext();
AuthenticationContext.displayName = "authenticated";
const UpdateAuthenticationContext = React.createContext();

export function useAuthenticated() {
  return useContext(AuthenticationContext);
}

export function useAuthenticatedUpdate() {
  return useContext(UpdateAuthenticationContext);
}

const AuthenticationProvider = ({ children }) => {
  const [cookieValue, update, remove] = useCookie("jwt", "");
  const [authenticated, setAuthenticated] = useState(() => {
    // return cookieValue ? jwtDecode(cookieValue).userId : null;
    return cookieValue ? true : false;
  });

  useEffect(() => {
    // auto updating user when cookie is edited
    setAuthenticated(() => {
      // const res = cookieValue ? jwtDecode(cookieValue) : null;
      // return res ? res.userId : null;
      return cookieValue ? true : false;
    });
  }, [cookieValue]);

  const authenticate = (token = null, options) => {
    if (token) {
      update(token, options);
    } else {
      // if 1st arg === false or no args at all
      remove();
    }
  };

  return (
    <AuthenticationContext.Provider value={authenticated}>
      <UpdateAuthenticationContext.Provider value={authenticate}>
        {children}
      </UpdateAuthenticationContext.Provider>
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
