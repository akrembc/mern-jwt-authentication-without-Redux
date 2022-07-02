import React, { Fragment } from "react";

export const combineComponents = (
  contextConsumer,
  providerChildren,
  ...contexts
) => {
  const lastProviderWithConsumerIndex = contexts.reduce((acc, cur, i) => {
    // if()
  }, null);

  const CombinedProvidersAndConsumers = contexts.reduce(
    (AccumulatedComponents, currentComponent, index) => {
      let { Provider, StateContext: ContextComponent = null } =
        currentComponent;
      console.log("outside", currentComponent, index);
      return ({ children }) => {
        return (
          <AccumulatedComponents>
            <Provider>
              {ContextComponent ? (
                <ContextComponent.Consumer>
                  {(context) => {
                    console.log("index", index, "type", typeof children);
                    contextConsumer.current[currentComponent.stateName] =
                      context;
                    console.log("inside");
                    console.log(currentComponent.stateName);
                    // if (typeof children === "object") {
                    //   console.log("in", children.children);
                    //   return children.children;
                    // }
                    if (index === 0) {
                      console.log("index", children);
                      return children;
                    } else {
                      console.log("no index");
                      return children.children;
                    }
                    // (
                    // <div>
                    //   {React.Children.map(children, (child) => {
                    //     console.log("current child", child.type.name);
                    //     return React.cloneElement(child, { context });
                    //   })}
                    // </div>
                    // );
                  }}
                </ContextComponent.Consumer>
              ) : (
                { children }
              )}
            </Provider>
          </AccumulatedComponents>
        );
      };
    },
    ({ children }) => <Fragment>{children}</Fragment>
  );

  return (
    // <Fragment>{providerChildren({ authenticated: true, showModal: true })}</Fragment>
    <CombinedProvidersAndConsumers>
      {providerChildren(contextConsumer.current)}
    </CombinedProvidersAndConsumers>
  );
};
