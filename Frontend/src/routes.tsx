import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";

export default [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];
