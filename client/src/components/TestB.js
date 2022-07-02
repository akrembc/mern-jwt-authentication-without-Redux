import React, { useEffect } from "react";
import { useLoginError } from "../contexts/LoginErrorContext";

// const TestB = ({ children }) => {
//   return <div>{children({ b: 1 })}</div>;
// };
const TestB = () => {
  const loginError = useLoginError();
  useEffect(() => {
    console.log("login error", loginError);
  }, []);

  return <div>TESTB {loginError}</div>;
};

export default TestB;
