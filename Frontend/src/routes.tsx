import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import ScenarioResult from "./pages/ScenarioResult.tsx";
import ScenarioSelection from "./pages/ScenarioSelection.tsx";
import SpinTheWheel from "./pages/SpinTheWheel.tsx";

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
    path: "/spin-the-wheel",
    element: <SpinTheWheel />,
  },

  {
    path: "/scenario-selection",
    element: <ScenarioSelection />,
  },

  {
    path: "/scenario-result",
    element: <ScenarioResult />,
  },
];
