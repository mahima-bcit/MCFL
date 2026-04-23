import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import AdminOverviewPage from "./pages/admin/AdminOverviewPage.tsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.tsx";
import { Navigate } from "react-router-dom";

export default [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <Navigate to="/admin/overview" replace />,
  },
  {
    path: "/admin/overview",
    element: <AdminOverviewPage />,
  },
  {
    path: "/admin/users",
    element: <AdminUsersPage />,
  }
];
