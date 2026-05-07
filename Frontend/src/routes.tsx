import { Navigate } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ParentsFeedback from "./pages/ParentFeedback";
import DashboardPage from "./pages/DashboardPage";
import GamePage from "./pages/GamePage";
import FeedbackPage from "./pages/FeedbackPage";
import ProfileSetupFlow from "./pages/ProfileSetupFlow";
import MoneyPicturePage from "./pages/MoneyPicturePage";
import RealMoneyPage from "./pages/RealMoneyPage";
import TransactionPage from "./pages/TransactionsPage";
import GameZonePage from "./pages/GameZonePage";

import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminUserFeedbackPage from "./pages/admin/AdminUserFeedbackPage";
import AdminParentFeedbackPage from "./pages/admin/AdminParentFeedbackPage";
import AdminScenariosPage from "./pages/admin/AdminScenariosPage";
import AdminManageScenariosPage from "./pages/admin/AdminManageScenariosPage";
import AdminAccessControlPage from "./pages/admin/AdminAccessControlPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminMoneyFeelingsPage from "./pages/admin/AdminMoneyFeelingsPage";

export default [
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { index: true, element: <Index /> },
            { path: "login", element: <Login /> },
            { path: "signup", element: <Signup /> },
            { path: "profile-setup", element: <ProfileSetupFlow /> },
            { path: "parent-feedback", element: <ParentsFeedback /> },
        ],
    },

    { path: "/dashboard", element: <ProtectedRoute requiredRole="User"><DashboardPage /></ProtectedRoute> },
    { path: "/game-zone", element: <ProtectedRoute requiredRole="User"><GameZonePage /></ProtectedRoute> },
    { path: "/game", element: <ProtectedRoute requiredRole="User"><GamePage /></ProtectedRoute> },
    { path: "/feedback", element: <ProtectedRoute requiredRole="User"><FeedbackPage /></ProtectedRoute> },
    { path: "/real-money/money-picture", element: <ProtectedRoute requiredRole="User"><MoneyPicturePage /></ProtectedRoute> },
    { path: "/real-money", element: <ProtectedRoute requiredRole="User"><RealMoneyPage /></ProtectedRoute> },
    { path: "/real-money/transactions", element: <ProtectedRoute requiredRole="User"><TransactionPage /></ProtectedRoute> },

    {
        path: "/admin",
        children: [
            { index: true, element: <Navigate to="/admin/overview" replace /> },
            { path: "overview", element: <ProtectedRoute requiredRole="Admin"><AdminOverviewPage /></ProtectedRoute> },
            { path: "users", element: <ProtectedRoute requiredRole="Admin"><AdminUsersPage /></ProtectedRoute> },
            { path: "user-feedback", element: <ProtectedRoute requiredRole="Admin"><AdminUserFeedbackPage /></ProtectedRoute> },
            { path: "parent-feedback", element: <ProtectedRoute requiredRole="Admin"><AdminParentFeedbackPage /></ProtectedRoute> },
            { path: "money-feelings", element: <ProtectedRoute requiredRole="Admin"><AdminMoneyFeelingsPage /></ProtectedRoute> },
            { path: "scenarios", element: <ProtectedRoute requiredRole="Admin"><AdminScenariosPage /></ProtectedRoute> },
            { path: "scenarios/manage", element: <ProtectedRoute requiredRole="Admin"><AdminManageScenariosPage /></ProtectedRoute> },
            { path: "access-control", element: <ProtectedRoute requiredRole="Admin"><AdminAccessControlPage /></ProtectedRoute> },
            { path: "settings", element: <ProtectedRoute requiredRole="Admin"><AdminSettingsPage /></ProtectedRoute> },
        ],
    },
];