import RootLayout from "./components/layout/RootLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ParentsFeedback from "./pages/ParentFeedback";

export default [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Index /> },
      { path: "login", element: <Login /> },
      { path: "parentFeedback", element: <ParentsFeedback /> },
    ],
  },
];