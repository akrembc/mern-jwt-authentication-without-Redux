import React, { useState, Fragment } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

import Modal from "./Modal";
import {
  useAuthenticated,
  useAuthenticatedUpdate,
} from "../contexts/AuthContext";
import { useModal, useModalUpdate } from "../contexts/ModalContext";
import {
  useLoginError,
  useLoginErrorUpdate,
} from "../contexts/LoginErrorContext";
import Form from "./Form";
import Button from "./Button";

const formFields = [
  {
    style: "mb-2",
    label: "Email",
    inputType: "email",
    invalidFieldNote: "Please enter a valid email format",
    afterFailBehavior: "focus",
    validate(input) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(input);
    },
  },
  {
    style: "mb-2",
    label: "Password",
    inputType: "password",
    invalidFieldNote: "Password need to have 5 characters at least",
    afterFailBehavior: "clear",
    validate: (input) => input.length > 4,
  },
];

const confirmButtonText = {
  confirmText: "Log In",
  loadingText: "Logging in...",
};

const Login = () => {
  const [isLoading, setLoading] = useState(false);
  const authenticated = useAuthenticated();
  const authenticate = useAuthenticatedUpdate();
  const showLoginModal = useModal();
  const setShowLoginModal = useModalUpdate();
  const loginError = useLoginError();
  const setLoginError = useLoginErrorUpdate();

  const handleButtonClick = () => {
    if (authenticated) {
      // Logout
      // setUser(false);
      authenticate(null);
      document.getElementById("login").blur();
    } else {
      setShowLoginModal(true);
    }
  };

  const handleSubmit = async (e, inputValues) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");
    let response;
    try {
      response = await axios.post("/api/auth/", {
        email: inputValues[0],
        password: inputValues[1],
      });

      const decoded = jwtDecode(response.data.token);
      const date = new Date(decoded.exp * 1000);
      authenticate(response.data.token, { expires: date });

      // const user = await axios.get("/api/auth", {
      //   // UNCOMMENT THEIS LATER !!!!!!
      //   headers: { Authorization: `Bearer ${response.data.token}` },
      // });
      // dispatch({ type: "success" });
      // setUser(user.data.email); // WRONG !!!!
      setLoading(false);
      setShowLoginModal(false);
      setLoginError("");
    } catch (error) {
      setLoading(false);
      setLoginError(error.response.data.errors?.[0].msg);
    }
  };

  // in useEffect dependency => useCallBack to save its ref => prevent infinte rerender
  // const updateLoginError = useCallback(
  //   (error) => {
  //     setLoginError(error);
  //   },
  //   [setLoginError]
  // );

  return (
    <Fragment>
      <Button
        id="login"
        className={`btn ${
          authenticated ? "btn-dark" : "btn-outline-dark"
        } mx-2 my-0 my-sm-0`}
        onClick={handleButtonClick}
        disabled={showLoginModal}
      >
        {authenticated ? "Log Out" : isLoading ? "Logging in..." : "Log in"}
      </Button>
      {showLoginModal ? (
        <Modal
          showModal={showLoginModal}
          setShowModal={(display) => {
            setShowLoginModal(display);
            if (!display) {
              setLoginError(""); // hide error after reopening modal
            }
          }}
          title="Log in"
          buttons={null}
        >
          <Form
            formFields={formFields}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            confirmButtonText={confirmButtonText}
            formError={loginError}
            setFormError={setLoginError}
          />
        </Modal>
      ) : null}
    </Fragment>
  );
};

export default Login;
