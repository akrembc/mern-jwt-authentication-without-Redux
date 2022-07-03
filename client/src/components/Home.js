import React, { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useModalUpdate } from "../contexts/ModalContext";
import { useLoginErrorUpdate } from "../contexts/LoginErrorContext";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setShowLoginModal = useModalUpdate();
  const setLoginError = useLoginErrorUpdate();

  // this ref is used to avoid adding location.state?.from as useEffect dependency
  // as navigate() order will led to state.from value to change which will cause
  // useEffect to get triggered again but with 1st condition being false
  // in that case modal won't be shown when we get redirected to current component
  const from = useRef(location.state?.from);

  // an alternative solution for not getting the model on reload:
  // import { createBrowserHistory } from "history";
  // we replace navigate() with the following without using ref:
  // const history = createBrowserHistory();
  // let state = { ...history.location.state };
  // history.replace({ ...history.location, state });

  useEffect(() => {
    if (from.current === "/protectedRoute") {
      setShowLoginModal(true);
      setLoginError("You need to log in first !");

      // replace: true to clear state value related to current path,
      // so when we refresh current page, the model won't be shown
      navigate(location.pathname, { replace: true }); // or pass empty object
    } else {
      setShowLoginModal(false);
      setLoginError("");
    }
  }, [
    location.state?.from,
    location.pathname,
    navigate,
    setLoginError,
    setShowLoginModal,
  ]);

  return (
    <div>
      <h1>Home</h1>
      <Link to="/protectedRoute">protected route</Link>
    </div>
  );
};

export default Home;
