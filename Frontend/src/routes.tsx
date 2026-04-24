import Index from "./pages/Index";
import Login from "./pages/Login";
import RootLayout from "./components/layout/RootLayout";
import ParentsFeedback from "./pages/ParentFeedback";
import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import { Navigate } from "react-router-dom";

export default [
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { index: true, element: <Index /> },
            { path: "login", element: <Login /> },
            { path: "admin", element: <Navigate to="/admin/overview" replace /> },
            { path: "/admin/overview", element: <AdminOverviewPage /> },
            { path: "/admin/users", element: <AdminUsersPage /> },
            { path: "parentFeedback", element: <ParentsFeedback /> },
        ],
    },
];