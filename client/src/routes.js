import { Navigate, Outlet } from "react-router-dom";

const obj = {
  DashboardLayout: {},
  Dashboard: {},
  Account: {},
  MemberGrid: {},
  AddMember: {},
  MainLayout: {},
  Login: {},
};

const {
  DashboardLayout,
  Dashboard,
  Account,
  MemberGrid,
  AddMember,
  MainLayout,
  Login,
} = obj;

// return <Navigate to="/login" state={{ from: location }} />;

const routes = (isLoggedIn) => [
  {
    path: "/app",
    element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/account", element: <Account /> },
      { path: "/", element: <Navigate to="/app/dashboard" /> },
      {
        path: "member",
        element: <Outlet />,
        children: [
          { path: "/", element: <MemberGrid /> },
          { path: "/add", element: <AddMember /> },
        ],
      },
    ],
  },
  {
    path: "/",
    element: !isLoggedIn ? <MainLayout /> : <Navigate to="/app/dashboard" />,
    children: [
      { path: "login", element: <Login /> },
      { path: "/", element: <Navigate to="/login" /> },
    ],
  },
];

export default routes;
