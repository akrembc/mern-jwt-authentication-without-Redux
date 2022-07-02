import React, { useEffect } from "react";

export const TestA1 = () => {
  console.log("a1 build");

  useEffect(() => {
    console.log("a1 is rendered");
  }, []);

  return <ChildA1>TestA1</ChildA1>;
};

export const TestA2 = () => {
  console.log("a2 build");

  useEffect(() => {
    console.log("a2 is rendered");
  }, []);

  return <ChildA2>TestA2</ChildA2>;
};

const ChildA1 = ({ children }) => {
  console.log("child of a1 build");

  useEffect(() => {
    console.log(" child of a1 is rendered");
  }, []);

  return <div>{children}</div>;
};

const NestedChildA2 = ({ children }) => {
  console.log("nested child a2 build");

  useEffect(() => {
    console.log(" nested child of a2 is rendered");
  }, []);

  return <div>{children}</div>;
};

const ChildA2 = ({ children }) => {
  console.log("child of a2 build");

  useEffect(() => {
    console.log("child of a2 is rendered");
  }, []);

  return <NestedChildA2>{children}</NestedChildA2>;
};

// in wrapper we include:
// <Fragment>
//   <TestA1 />
//   <TestA2 />
// </Fragment>
