import React from "react";
import TestCb from "./TestCb";

const TestCbChild = () => {
  return (
    <TestCb>
      {
        // simple value vs inside object
        ({ first, setFirst }) => {
          console.log("value inside cb", first);
          return (
            <>
              <h1>{first}</h1>
              <button onClick={() => setFirst((prev) => ++prev)}>+</button>
            </>
          );
        }
      }
    </TestCb>
  );
};

export default TestCbChild;
