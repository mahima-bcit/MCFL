import { Navigate } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ParentsFeedback from "./pages/ParentFeedback";
import DashboardPage from "./pages/DashboardPage";
import GamePage from "./pages/GamePage.tsx";
import MoneyPage from "./pages/MoneyPage.tsx";
import FeedbackPage from "./pages/FeedbackPage.tsx";
import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminScenariosPage from "./pages/admin/AdminScenariosPage";
import AdminManageScenariosPage from "./pages/admin/AdminManageScenariosPage";

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
    ],
  },
  {
    path: "/admin",
    children: [
      { index: true, element: <Navigate to="/admin/overview" replace /> },
      { path: "overview", element: <AdminOverviewPage /> },
      { path: "users", element: <AdminUsersPage /> },
      { path: "scenarios", element: <AdminScenariosPage /> },
      { path: "scenarios/manage", element: <AdminManageScenariosPage /> },
    ],
  },
];
