import { Fragment, useEffect, useRef } from "react";

const LastProvider = ({ children: lastProviderChildren, state }) => {
  useEffect(() => {
    console.log("last provider props", state);
  }, [state]);
  console.log("last provider props OUT", state);

  return <Fragment>{lastProviderChildren(state)}</Fragment>;
};

const Combiner = ({ children: combinerChildren, contexts }) => {
  const currentState = useRef({});
  useEffect(() => {
    console.log("reload");
  });
  const ContextReducer = contexts.reduce(
    (PreviouslyAccumulated, currentContext, index) => {
      const {
        Provider: CurrentProvider,
        StateContext = null, // its not guarenteed to pass StateContext
        // we only want to get stateName when we already have StateContext
        StateContext: { displayName: stateName } = {}, // default value to avoid error
      } = currentContext;

      // includedProvider is the next provider to be included (index + 1)
      return ({ children: includedProvider }) => (
        <PreviouslyAccumulated>
          <CurrentProvider>
            {StateContext ? (
              <StateContext.Consumer>
                {(context) => {
                  currentState.current[stateName] = context;
                  console.log("new element:", context);
                  console.log("current state obj:", stateName);
                  console.log("its child", includedProvider);
                  console.log(
                    "currentState new value",
                    JSON.stringify(currentState.current)
                  );
                  if (index < contexts.length - 1) return includedProvider;
                  return combinerChildren(currentState.current);
                }}
              </StateContext.Consumer>
            ) : index < contexts.length - 1 ? (
              includedProvider
            ) : (
              <LastProvider state={currentState.current}>
                {combinerChildren}
              </LastProvider>
            )}
          </CurrentProvider>
        </PreviouslyAccumulated>
      );
    },
    ({ children }) => <Fragment>{children}</Fragment>
  );

  return <ContextReducer />;
};

export default Combiner;
