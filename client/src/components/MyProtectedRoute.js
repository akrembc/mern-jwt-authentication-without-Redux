import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import useCookie from "../customHooks/useCookie";

const MyProtectedRoute = () => {
  const [user, setUser] = useState({});
  const [cookieValue] = useCookie("jwt");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // const user = await axios.get("/api/auth", {
        //   // UNCOMMENT THEIS LATER !!!!!!
        //   headers: { Authorization: `Bearer ${response.data.token}` },
        // });
        const response = await axios.get("/api/auth", {
          headers: { Authorization: `Bearer ${cookieValue}` },
        });
        console.log(JSON.stringify("response", response.data));
        setUser(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserData();
  }, [cookieValue]);

  return (
    <div>
      <Link to="/">home</Link>
      <h1>first name {user ? user.firstName : "loading"}</h1>
      <h1>last name {user ? user.lastName : "loading"}</h1>
      <h1>email {user ? user.email : "loading"}</h1>
      {/* <h1>id {user ? user._id : "loading"}</h1> */}
    </div>
  );
};

export default MyProtectedRoute;
