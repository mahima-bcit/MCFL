import { Navigate } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ParentsFeedback from "./pages/ParentFeedback";
import DashboardPage from "./pages/DashboardPage";
import GamePage from "./pages/GamePage";
import MoneyPage from "./pages/MoneyPage";
import FeedbackPage from "./pages/FeedbackPage";
import MoneyPicture from "./pages/MoneyPicture";
import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";

export default [
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { index: true, element: <Index /> },
            { path: "login", element: <Login /> },
            { path: "parentFeedback", element: <ParentsFeedback /> },
            { path: "dashboard", element: <DashboardPage /> },
            { path: "game", element: <GamePage /> },
            { path: "money", element: <MoneyPage /> },
            { path: "feedback", element: <FeedbackPage /> },
            { path: "moneyPicture", element: <MoneyPicture /> },
        ],
    },
    {
        path: "/admin",
        children: [
            { index: true, element: <Navigate to="/admin/overview" replace /> },
            { path: "overview", element: <AdminOverviewPage /> },
            { path: "users", element: <AdminUsersPage /> },
        ],
    },
];