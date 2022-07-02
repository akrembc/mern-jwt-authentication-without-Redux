import React from "react";

import Button from "./Button";
import Login from "./Login";
import { useAuthenticated } from "../contexts/AuthContext";
import { useModal } from "../contexts/ModalContext";
import { useLocation, Link } from "react-router-dom";

const Navbar = () => {
  const authenticated = useAuthenticated();
  const showLoginModal = useModal();
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          Super<span className="text-danger">Uber</span>
        </a>
        {/* hamburger menu */}
        {/* <div className="me-auto"></div> */}
        {/* UNCOMMENT NEXT LINES !!!!!!!!!!!!!!!!!!!!! */}
        <div className="flex-grow-1 text-success">{location.pathname}</div>
        {location.pathname === "/register" ? "Already have an account?" : null}
        <div>
          <Login />
          {authenticated || location.pathname === "/register" ? null : (
            <Button
              as={Link}
              to="/register"
              id="register"
              className={`btn btn-primary my-0 my-sm-0 mx-1`}
              disabled={showLoginModal}
            >
              Sign up
            </Button>
          )}
        </div>
        <button
          className="navbar-toggler ms-3"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse flex-grow-0 ms-3"
          id="navbarColor01"
        >
          {/* <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <a className="nav-link active" href="/">
                    Home
                    <span className="visually-hidden">(current)</span>
                  </a>
                </li>
              </ul> */}
          <div className="me-auto"></div>
          <div className="d-flex flex-row-reverse">
            <span className="text">Text</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
