import React, { useState, Fragment } from "react";

const TestCb = ({ children }) => {
  const [first, setFirst] = useState(0);

  // div vs Fragment
  return <Fragment>{children({ first, setFirst })}</Fragment>;
};

export default TestCb;
