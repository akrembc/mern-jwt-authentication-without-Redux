import React from "react";

// const TestA = ({ children }) => {
//   return <div>{children({ a: 1 })}</div>;
// };
const TestA = ({ authenticated, showModal }) => {
  return <div>{`logged in? ${authenticated} showModal: ${showModal}`}</div>;
};

export default TestA;
