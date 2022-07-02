import { useRef, useEffect } from "react";
import { useMatch } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../components/Home";
import MyProtectedRoute from "../components/MyProtectedRoute";
import Register from "../components/Register";

export const useRouting = (authenticated) => {
  const previousAuthValue = useRef(authenticated);
  const match = useMatch("/protectedRoute");

  // we need to know the previous value of "authenticated" to prevent showing
  // login form right after logging out: in both cases we're being auto
  // redirected from a protected route, the difference is that in one case,
  // it was a result of signing out: if "authenticated" is different from its
  // last saved value vs redirected for not being authenticated at first
  useEffect(() => {
    previousAuthValue.current = authenticated;
  }, [authenticated]);

  return [
    {
      path: "/protectedRoute",
      element: (
        <ProtectedRoute
          pass={authenticated}
          state={{
            from:
              match && previousAuthValue.current === authenticated
                ? match.pathname
                : null,
          }}
        >
          <MyProtectedRoute />
        </ProtectedRoute>
      ),
    },
    {
      path: "/",
      element: (
        <ProtectedRoute pass={!authenticated} redirectTo="/protectedRoute">
          <Home />
        </ProtectedRoute>
      ),
    },
    {
      path: "/register",
      element: (
        <ProtectedRoute pass={!authenticated} redirectTo="/protectedRoute">
          <Register />
        </ProtectedRoute>
      ),
    },
    // {
    //   path: "/test",
    //   index: true,
    //   element: <Test />,
    // },
  ];
};
