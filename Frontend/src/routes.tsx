import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import ParentFeedback from "./pages/ParentFeedback.tsx";

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
    path: "/parent-feedback",
    element: <ParentFeedback />,
  },
  {
    path: "/parent-feedback/:token",
    element: <ParentFeedback />,
  },
];