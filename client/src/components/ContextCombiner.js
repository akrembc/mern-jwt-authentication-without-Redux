import React, { Fragment } from "react";

const ContextCombiner = ({ children: combinerChildren, contexts }) => {
  const ContextReducer = contexts.reduce(
    (PreviouslyAccumulated, currentContext, index) => {
      const {
        Provider: CurrentProvider,
        StateContext = null, // its not guarenteed to pass StateContext
        // we only want to get stateName when we already have StateContext
        StateContext: { displayName: stateName } = {},
      } = currentContext;

      // includedProvider has the next provider to be included (index + 1)
      return ({ children: includedProvider }) => (
        <PreviouslyAccumulated>
          {({ currentState }) => (
            <CurrentProvider>
              {StateContext ? (
                <StateContext.Consumer>
                  {(context) => {
                    currentState[stateName] = context;
                    if (index < contexts.length - 1)
                      return includedProvider({ currentState });
                    return combinerChildren(currentState); // or <CombinerChildren ../>
                  }}
                </StateContext.Consumer>
              ) : index < contexts.length - 1 ? (
                includedProvider({ currentState })
              ) : (
                combinerChildren(currentState) // or <CombinerChildren ../>
              )}
            </CurrentProvider>
          )}
        </PreviouslyAccumulated>
      );
    },
    ({ children }) => <Fragment>{children({ currentState: {} })}</Fragment>
  );

  return <ContextReducer />;
};

export default ContextCombiner;
