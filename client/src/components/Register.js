import React, { useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

import Form from "./Form";
import { useAuthenticatedUpdate } from "../contexts/AuthContext";

const formFields = [
  {
    style: "mb-1 col-12 col-sm-6",
    label: "First Name",
    inputType: "text",
    invalidFieldNote: "First name is required",
    afterFailBehavior: "focus",
    validate: (input) => input.length > 0,
  },
  {
    style: "mb-1 col-12 col-sm-6",
    label: "Last Name",
    inputType: "text",
    invalidFieldNote: "Last name is required",
    validate: (input) => input.length > 0,
  },
  {
    style: "mb-1",
    label: "Email",
    inputType: "text",
    invalidFieldNote: "Please enter a valid email format",
    validate(input) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(input);
    },
  },
  {
    style: "mb-1",
    label: "Password",
    inputType: "password",
    invalidFieldNote: "Password need to have 5 characters at least",
    afterFailBehavior: "clear",
    validate: (input) => input.length > 4,
  },
];

const confirmButtonText = {
  confirmText: "Sign up",
  loadingText: "Loading...",
};

const Register = () => {
  const [isLoading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState(false);

  const authenticate = useAuthenticatedUpdate();

  const handleSubmit = async (e, inputValues) => {
    e.preventDefault();
    setLoading(true);
    setSignupError("");
    let response;
    try {
      // inputValues got to be an array as we are dealing with its indexes in
      // Form component, but here we need to send an object to the server
      response = await axios.post("/api/register/", {
        firstName: inputValues[0],
        lastName: inputValues[1],
        email: inputValues[2],
        password: inputValues[3],
      });

      const decoded = jwtDecode(response.data.token);
      const date = new Date(decoded.exp * 1000);
      authenticate(response.data.token, { expires: date });

      setLoading(false);
      setSignupError("");
    } catch (error) {
      setLoading(false);
      setSignupError(error.response.data.errors?.[0].msg);
      // console.log("error", error.response);
      // console.log("register error", error.response.data.errors?.[0].msg);
    }
  };

  return (
    <div className="row row-cols-3 shadow my-3">
      <section className="col-12 text-align text-center mt-3">
        <h2>
          Sign up and experience Super<span className="text-danger">Uber</span>{" "}
          now
        </h2>
      </section>
      <div className="col-12 col-lg-6">
        <img
          src="/superuber.webp"
          alt="img"
          style={{ maxWidth: "100%", minHeight: "100%" }}
        />
      </div>
      <section className="col-12 col-lg-6 my-3 py-3">
        <Form
          formFields={formFields}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          confirmButtonText={confirmButtonText}
          formError={signupError}
          setFormError={setSignupError}
        />
      </section>
    </div>
  );
};

export default Register;
