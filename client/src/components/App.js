import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Navbar from "./Navbar";
import { Routing } from "./Routing";
import { AppContextProvider } from "./AppContextProvider";

const App = () => {
  useEffect(() => {
    // IT WORKS !! but better use css file
    document.body.style.height = "100%";
    document.body.style.minHeight = "100vh";
  }, []);

  // we need to provide AND use showModal value at the same component as changing its value
  // in child component had to be known in parent component & we can't use useModal() here,
  // one solution would be to use <Context.Consumer> with a callback function as a child.
  // here, we're combining all needed context providers
  return (
    <AppContextProvider>
      {({ showModal }) => {
        return (
          <div className={`${showModal ? "opacity-50" : ""}`}>
            <Router>
              <Navbar />
              <div className="container" tabIndex="-1">
                <Routing />
              </div>
            </Router>
          </div>
        );
      }}
    </AppContextProvider>
  );
};

export default App;
