import { Navigate } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ParentsFeedback from "./pages/ParentFeedback";
import DashboardPage from "./pages/DashboardPage";
import GamePage from "./pages/GamePage";
import MoneyPage from "./pages/MoneyPage";
import FeedbackPage from "./pages/FeedbackPage";
import UserFeedback from "./pages/UserFeedback";
import MoneyPicture from "./pages/MoneyPicture";
import ProfileSetupFlow from "./pages/ProfileSetupFlow";
import GameMoneyPage from "./pages/GameMoneyPage";
import RealMoneyPage from "./pages/RealMoneyPage";
import TransactionPage from "./pages/TransactionsPage";

import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminUserFeedbackPage from "./pages/admin/AdminUserFeedbackPage";
import AdminParentFeedbackPage from "./pages/admin/AdminParentFeedbackPage";
import AdminScenariosPage from "./pages/admin/AdminScenariosPage";
import AdminManageScenariosPage from "./pages/admin/AdminManageScenariosPage";
import AdminAccessControlPage from "./pages/admin/AdminAccessControlPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

export default [
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { index: true, element: <Index /> },
            { path: "login", element: <Login /> },
            { path: "signup", element: <Signup /> },
            { path: "profile-setup", element: <ProfileSetupFlow /> },
            { path: "profile-setup-flow", element: <ProfileSetupFlow /> },
            { path: "parentFeedback", element: <ParentsFeedback /> },
        ],
    },

    { path: "/dashboard", element: <DashboardPage /> },
    { path: "/game", element: <GamePage /> },
    { path: "/money", element: <MoneyPage /> },
    { path: "/feedback", element: <FeedbackPage /> },
    { path: "/userFeedback", element: <UserFeedback /> },
    { path: "/moneyPicture", element: <MoneyPicture /> },
    { path: "/game-money", element: <GameMoneyPage /> },
    { path: "/real-money", element: <RealMoneyPage /> },
    { path: "/real-money/transactions", element: <TransactionPage /> },

    {
        path: "/admin",
        children: [
            { index: true, element: <Navigate to="/admin/overview" replace /> },
            { path: "overview", element: <AdminOverviewPage /> },
            { path: "users", element: <AdminUsersPage /> },
            { path: "user-feedback", element: <AdminUserFeedbackPage /> },
            { path: "parent-feedback", element: <AdminParentFeedbackPage /> },
            { path: "scenarios", element: <AdminScenariosPage /> },
            { path: "scenarios/manage", element: <AdminManageScenariosPage /> },
            { path: "access-control", element: <AdminAccessControlPage /> },
            { path: "settings", element: <AdminSettingsPage /> },
        ],
    },
];